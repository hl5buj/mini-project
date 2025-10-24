import { useState, useEffect } from 'react';
import { commentService } from '../../services/commentService';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const CommentList = ({ lectureId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('-created_at'); // newest first

  useEffect(() => {
    fetchComments();
  }, [lectureId, sortOrder]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await commentService.getComments({
        lecture: lectureId,
        ordering: sortOrder,
      });

      setComments(data.results || []);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      setError('댓글을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComment = async (commentData) => {
    try {
      await commentService.createComment(commentData);
      await fetchComments(); // Refresh comments
    } catch (err) {
      console.error('Failed to create comment:', err);
      throw err;
    }
  };

  const handleEditComment = async (id, commentData) => {
    try {
      await commentService.updateComment(id, commentData);
      await fetchComments(); // Refresh comments
    } catch (err) {
      console.error('Failed to edit comment:', err);
      throw err;
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await commentService.deleteComment(id);
      await fetchComments(); // Refresh comments
    } catch (err) {
      console.error('Failed to delete comment:', err);
      throw err;
    }
  };

  // Build comment tree (nest replies)
  const buildCommentTree = (comments) => {
    const commentMap = {};
    const rootComments = [];

    // Create a map of all comments
    comments.forEach((comment) => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });

    // Build the tree structure
    comments.forEach((comment) => {
      if (comment.parent) {
        // This is a reply
        const parent = commentMap[comment.parent];
        if (parent) {
          parent.replies.push(commentMap[comment.id]);
        }
      } else {
        // This is a root comment
        rootComments.push(commentMap[comment.id]);
      }
    });

    return rootComments;
  };

  const commentTree = buildCommentTree(comments);

  return (
    <div className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[--color-text-primary]">
          댓글 {comments.length}개
        </h2>

        {/* Sort */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-3 py-1.5 bg-[--color-bg-dark] border border-[--color-border] rounded-md text-sm text-[--color-text-primary] focus:outline-none focus:border-[--color-primary]"
        >
          <option value="-created_at">최신순</option>
          <option value="created_at">오래된순</option>
        </select>
      </div>

      {/* Comment form */}
      <div className="mb-6 pb-6 border-b border-[--color-border]">
        <CommentForm
          lectureId={lectureId}
          onSubmit={handleCreateComment}
          placeholder="댓글을 작성하세요..."
          submitText="댓글 작성"
        />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-8 text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-[--color-primary] border-t-transparent rounded-full"></div>
          <p className="mt-2 text-[--color-text-secondary]">댓글을 불러오는 중...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="py-8 text-center">
          <p className="text-[--color-primary] mb-2">{error}</p>
          <button
            onClick={fetchComments}
            className="text-sm text-[--color-text-secondary] hover:text-[--color-primary] transition-colors"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && comments.length === 0 && (
        <div className="py-12 text-center">
          <div className="text-[--color-text-disabled] text-4xl mb-2">💬</div>
          <p className="text-[--color-text-secondary]">
            첫 번째 댓글을 작성해보세요
          </p>
        </div>
      )}

      {/* Comments list */}
      {!loading && !error && commentTree.length > 0 && (
        <div className="divide-y divide-[--color-border]">
          {commentTree.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              lectureId={lectureId}
              onReply={handleCreateComment}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList;
