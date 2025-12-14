/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Avatar } from './Avatar';
import { BaseButton } from './BaseButton';
import { useTranslation } from 'react-i18next'; 
const Comment = ({ name, content }) => {
  return (
    <div className="comments-addcomment">
      <h4>{name}</h4>
      <p>{content}</p>
    </div>
  );
};

const CommentForm = ({ addComment }) => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const { t } = useTranslation(); 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !content) return;
    addComment({ name, content });
    setName('');
    setContent('');
  };

  return (
    <div className="comments-form">
        <form onSubmit={handleSubmit}>
        <div>
          <Avatar img={"default-avatar"} avtsmall={true} clas={"avatar"} nameSmall={"namesmall"} />
        </div>
          <textarea
            placeholder={t('globals.comment')}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <BaseButton 
          textLabel={true} 
          label={t('globals.commentBtn')} 
          classs={'button primary'} 
          colorbtn={"var(--bg-primary)"}
          colortextbtnprimary={"var(--light)"}
          colorbtnhoverprimary={"var(--bg-primary-tr)"}
          colortextbtnhoverprimary={"white"} 
          />
        </form>
    </div>
  );
};

const Comments = () => {
  const [comments, setComments] = useState([]);
  const { t } = useTranslation(); 
  const addComment = (comment) => {
    setComments([...comments, comment]);
  };

  return (
    <div className="comments">
      <h2>{t('globals.comments')}</h2>
      <CommentForm addComment={addComment} />
      <div className="comments-list">
        {comments.map((comment, index) => (
          <Comment key={index} name={comment.name} content={comment.content} />
        ))}
      </div>
    </div>
  );
};

export default Comments;
