const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

admin.initializeApp();

// Helper function to get collection data
const getCollection = async (collectionName, filter) => {
  const db = admin.firestore();
  let query = db.collection(collectionName);
  if (filter) {
    query = query.where(filter.key, "==", filter.value);
  }
  const snapshot = await query.get();
  return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
};

exports.createCampaign = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    console.log("Request body:", JSON.stringify(req.body));

    try {
      const {title, description, category, tags, creator} = req.body;

      if (
        !title ||
        !description ||
        !category ||
        !tags ||
        !Array.isArray(tags) ||
        tags.length < 2 ||
        !creator ||
        !creator.id ||
        !creator.name
      ) {
        return res.status(400).send(
            "Missing or invalid required campaign data.",
        );
      }

      const db = admin.firestore();
      const newCampaign = {
        title,
        description,
        category,
        tags,
        creator,
        upvotes: 0,
        downvotes: 0,
        status: "voting", // Initial status
        isApproved: false, // For voting pool
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await db.collection("campaigns").add(newCampaign);
      res.status(201).send({id: docRef.id, ...newCampaign});
    } catch (error) {
      console.error("Error creating campaign:", error);
      res.status(500).send("Error creating campaign");
    }
  });
});

exports.getCampaigns = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const {status} = req.query;
      const campaigns = await getCollection(
          "campaigns",
          status ? {key: "status", value: status} : undefined,
      );
      res.status(200).json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).send("Error fetching campaigns");
    }
  });
});

exports.vote = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const {campaignId, voteType} = req.body;

    if (!campaignId || !voteType) {
      return res.status(400).send("Missing campaignId or voteType");
    }

    try {
      const db = admin.firestore();
      const campaignRef = db.collection("campaigns").doc(campaignId);

      await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(campaignRef);
        if (!doc.exists) {
          throw new Error("Document does not exist!");
        }

        const data = doc.data();
        let {upvotes = 0, downvotes = 0, status, isApproved} = data;

        if (voteType === "upvote") {
          upvotes += 1;
        } else if (voteType === "downvote") {
          downvotes += 1;
        }

        if (upvotes >= 5 && status === "voting") {
          status = "active";
          isApproved = true;
        }

        transaction.update(campaignRef, {
          upvotes,
          downvotes,
          status,
          isApproved,
        });
      });

      res.status(200).send({message: "Vote successful"});
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).send("Error updating document");
    }
  });
});

exports.getBrandDashboardData = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const [campaigns, coupons, messages, products] = await Promise.all([
        getCollection("campaigns"),
        getCollection("coupons"),
        getCollection("messages"),
        getCollection("products"),
      ]);

      const metricsData = [
        {
          title: "Total Campaigns",
          value: campaigns.length,
          change: "0%",
          changeType: "neutral",
        },
        {
          title: "Total Revenue",
          value: "$0",
          change: "0%",
          changeType: "neutral",
        },
        {
          title: "Total Engagement",
          value: "0%",
          change: "0%",
          changeType: "neutral",
        },
        {
          title: "Conversion Rate",
          value: "0%",
          change: "0%",
          changeType: "neutral",
        },
      ];

      res.status(200).json({
        metricsData,
        campaignsData: campaigns,
        couponsData: coupons,
        messagesData: messages,
        productsData: products,
      });
    } catch (error) {
      console.error("Error fetching brand dashboard data:", error);
      res.status(500).send("Error fetching brand dashboard data");
    }
  });
});

exports.getCampaignDetails = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const {id} = req.query;

    if (!id) {
      return res.status(400).send("Missing campaign ID");
    }

    try {
      const db = admin.firestore();
      const campaignDoc = await db.collection("campaigns").doc(id).get();

      if (!campaignDoc.exists) {
        return res.status(404).send("Campaign not found");
      }

      const campaign = {id: campaignDoc.id, ...campaignDoc.data()};

      const [comments, updates, relatedCampaigns] = await Promise.all([
        getCollection(`campaigns/${id}/comments`),
        getCollection(`campaigns/${id}/updates`),
        getCollection("campaigns"),
      ]);

      res.status(200).json({
        campaign,
        comments,
        updates,
        relatedCampaigns: relatedCampaigns
            .filter((c) => c.id !== id)
            .slice(0, 3),
      });
    } catch (error) {
      console.error("Error fetching campaign details:", error);
      res.status(500).send("Error fetching campaign details");
    }
  });
});

exports.getUserProfileData = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const {userId} = req.query;

    if (!userId) {
      return res.status(400).send("Missing user ID");
    }

    try {
      const db = admin.firestore();
      const userDoc = await db.collection("users").doc(userId).get();

      if (!userDoc.exists) {
        return res.status(404).send("User not. found");
      }

      const user = {id: userDoc.id, ...userDoc.data()};

      const campaignsSnapshot = await db.collection("campaigns")
          .where("creator.id", "==", userId).get();
      const campaigns = campaignsSnapshot.docs
          .map((doc) => ({id: doc.id, ...doc.data()}));

      const activeCampaigns = campaigns.filter((c) => c.status === "active");
      const createdCampaigns = campaigns;
      const completedCampaigns = campaigns
          .filter((c) => c.status === "completed");

      res.status(200).json({
        user,
        campaigns: {
          active: activeCampaigns,
          created: createdCampaigns,
          completed: completedCampaigns,
        },
        activities: [], // No activities collection yet
      });
    } catch (error) {
      console.error("Error fetching user profile data:", error);
      res.status(500).send("Error fetching user profile data");
    }
  });
});

exports.getTimelineFeedData = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const {status} = req.query;
      const filter = status ? {key: "status", value: status} : undefined;

      const [campaigns, users] = await Promise.all([
        getCollection("campaigns", filter),
        getCollection("users"),
      ]);

      const trendingCampaigns = campaigns.filter((c) => c.isTrending);
      const currentUser = users.length > 0 ? users[0] : null;

      res.status(200).json({
        campaigns,
        trendingCampaigns,
        currentUser,
        hasMore: false,
      });
    } catch (error) {
      console.error("Error fetching timeline feed data:", error);
      res.status(500).send("Error fetching timeline feed data");
    }
  });
});

exports.getNotifications = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const notifications = await getCollection("notifications");
      res.status(200).json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).send("Error fetching notifications");
    }
  });
});
