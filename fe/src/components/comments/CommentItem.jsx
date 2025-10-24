import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import CommentForm from './CommentForm';
import Button from '../common/Button';
import { formatRelativeTime } from '../../utils/formatters';

const CommentItem = ({
  comment,
  lectureId,
  onReply,
  onEdit,
  onDelete,
  depth = 0
}) => {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAuthor = user?.id === comment.author?.id;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const maxDepth = 2; // Maximum nesting level

  const handleReplySubmit = async (commentData) => {
    await onReply(commentData);
    setIsReplying(false);
  };

  const handleEditSubmit = async (commentData) => {
    await onEdit(comment.id, commentData);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('정말 이 댓글을 삭제하시겠습니까?')) {
      setIsDeleting(true);
      try {
        await onDelete(comment.id);
      } catch (error) {
        console.error('Failed to delete comment:', error);
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className={`${depth > 0 ? 'ml-12' : ''}`}>
      <div className="flex gap-3 py-4">
        {/* Avatar */}
        {comment.author?.profile_image ? (
          <img
            src={comment.author.profile_image}
            alt={comment.author.username}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[--color-primary] flex items-center justify-center text-white font-semibold flex-shrink-0">
            {comment.author?.username?.charAt(0).toUpperCase() || '?'}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-[--color-text-primary]">
              {comment.author?.username || '알 수 없음'}
            </span>
            <span className="text-xs text-[--color-text-disabled]">
              {formatRelativeTime(comment.created_at)}
            </span>
            {comment.updated_at !== comment.created_at && (
              <span className="text-xs text-[--color-text-disabled]">(수정됨)</span>
            )}
          </div>

          {/* Comment body */}
          {isEditing ? (
            <div className="mt-2">
              <CommentForm
                lectureId={lectureId}
                onSubmit={handleEditSubmit}
                onCancel={() => setIsEditing(false)}
                placeholder="댓글을 수정하세요..."
                initialValue={comment.content}
                submitText="저장"
              />
            </div>
          ) : (
            <>
              <p className="text-[--color-text-primary] whitespace-pre-wrap break-words">
                {comment.content}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-2">
                {depth < maxDepth && (
                  <button
                    onClick={() => setIsReplying(!isReplying)}
                    className="text-sm text-[--color-text-secondary] hover:text-[--color-primary] transition-colors"
                  >
                    답글
                  </button>
                )}

                {isAuthor && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm text-[--color-text-secondary] hover:text-[--color-primary] transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="text-sm text-[--color-text-secondary] hover:text-[--color-primary] transition-colors disabled:opacity-50"
                    >
                      {isDeleting ? '삭제 중...' : '삭제'}
                    </button>
                  </>
                )}
              </div>

              {/* Reply form */}
              {isReplying && (
                <div className="mt-4">
                  <CommentForm
                    lectureId={lectureId}
                    parentId={comment.id}
                    onSubmit={handleReplySubmit}
                    onCancel={() => setIsReplying(false)}
                    placeholder="답글을 작성하세요..."
                    submitText="답글 작성"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Replies */}
      {hasReplies && !isEditing && (
        <div className="border-l-2 border-[--color-border]">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              lectureId={lectureId}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
