import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CommentSection = ({ comments: initialComments, onAddComment }) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const formatTimeAgo = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInMinutes = Math.floor((now - commentDate) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleSubmitComment = (e) => {
    e?.preventDefault();
    if (!newComment?.trim()) return;

    const comment = {
      id: Date.now(),
      user: {
        name: "You",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        verified: false
      },
      content: newComment,
      timestamp: new Date(),
      likes: 0,
      replies: []
    };

    setComments([comment, ...comments]);
    setNewComment('');
    onAddComment?.(comment);
  };

  const handleSubmitReply = (commentId) => {
    if (!replyText?.trim()) return;

    const reply = {
      id: Date.now(),
      user: {
        name: "You",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        verified: false
      },
      content: replyText,
      timestamp: new Date(),
      likes: 0
    };

    setComments(comments?.map(comment => 
      comment?.id === commentId 
        ? { ...comment, replies: [...comment?.replies, reply] }
        : comment
    ));
    
    setReplyText('');
    setReplyingTo(null);
  };

  const handleLikeComment = (commentId, isReply = false, parentId = null) => {
    if (isReply) {
      setComments(comments?.map(comment => 
        comment?.id === parentId
          ? {
              ...comment,
              replies: comment?.replies?.map(reply =>
                reply?.id === commentId
                  ? { ...reply, likes: reply?.likes + 1 }
                  : reply
              )
            }
          : comment
      ));
    } else {
      setComments(comments?.map(comment => 
        comment?.id === commentId
          ? { ...comment, likes: comment?.likes + 1 }
          : comment
      ));
    }
  };

  const CommentItem = ({ comment, isReply = false, parentId = null }) => (
    <div className={`${isReply ? 'ml-12' : ''}`}>
      <div className="flex space-x-3">
        <Image
          src={comment?.user?.avatar}
          alt={comment?.user?.name}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold text-foreground text-sm">
                {comment?.user?.name}
              </span>
              {comment?.user?.verified && (
                <Icon name="BadgeCheck" size={14} className="text-primary" />
              )}
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(comment?.timestamp)}
              </span>
            </div>
            <p className="text-foreground text-sm leading-relaxed">
              {comment?.content}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-2">
            <button
              onClick={() => handleLikeComment(comment?.id, isReply, parentId)}
              className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Icon name="Heart" size={14} />
              <span>{comment?.likes}</span>
            </button>
            
            {!isReply && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment?.id ? null : comment?.id)}
                className="text-xs text-muted-foreground hover:text-foreground transition-smooth"
              >
                Reply
              </button>
            )}
          </div>

          {/* Reply Form */}
          {replyingTo === comment?.id && (
            <div className="mt-3">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder={`Reply to ${comment?.user?.name}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e?.target?.value)}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => handleSubmitReply(comment?.id)}
                  disabled={!replyText?.trim()}
                >
                  Reply
                </Button>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment?.replies && comment?.replies?.length > 0 && (
            <div className="mt-4 space-y-3">
              {comment?.replies?.map((reply) => (
                <CommentItem
                  key={reply?.id}
                  comment={reply}
                  isReply={true}
                  parentId={comment?.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-card rounded-lg p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        Comments ({comments?.length})
      </h2>
      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className="flex space-x-3">
          <Image
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            alt="Your avatar"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e?.target?.value)}
              className="mb-2"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!newComment?.trim()}
              iconName="Send"
              iconPosition="left"
              iconSize={14}
            >
              Comment
            </Button>
          </div>
        </div>
      </form>
      {/* Comments List */}
      <div className="space-y-6">
        {comments?.map((comment) => (
          <CommentItem key={comment?.id} comment={comment} />
        ))}
        
        {comments?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="MessageCircle" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;