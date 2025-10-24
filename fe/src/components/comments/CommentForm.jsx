import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';

const CommentForm = ({
  lectureId,
  parentId = null,
  onSubmit,
  onCancel,
  placeholder = '댓글을 작성하세요...',
  initialValue = '',
  submitText = '작성'
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        lecture: lectureId,
        parent: parentId,
        content: content.trim(),
      });

      setContent('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-3">
        {/* User avatar */}
        {user?.profile_image ? (
          <img
            src={user.profile_image}
            alt={user.username}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[--color-primary] flex items-center justify-center text-white font-semibold flex-shrink-0">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Input */}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full px-4 py-2.5 bg-[--color-bg-dark] border border-[--color-border] rounded-md text-[--color-text-primary] placeholder-[--color-text-disabled] focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:border-transparent resize-none"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 ml-[52px]">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            취소
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!content.trim() || isSubmitting}
          loading={isSubmitting}
        >
          {submitText}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
