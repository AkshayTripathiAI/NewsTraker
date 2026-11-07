import React, { useState } from 'react';

const formatDate = (iso) => {
  if (!iso) return '';
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
};

const NewsCard = ({ article }) => {
  const { title, description, url, urlToImage, source, publishedAt } = article;
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = urlToImage && !imageFailed;

  return (
    <article className="news-card">
      {showImage ? (
        <img
          src={urlToImage}
          alt=""
          className="news-image"
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="news-image placeholder" aria-hidden="true">
          {source?.name || 'News'}
        </div>
      )}
      <div className="news-details">
        <div className="news-meta">
          {source?.name && <span className="news-source">{source.name}</span>}
          {publishedAt && <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>}
        </div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
        <a href={url} target="_blank" rel="noopener noreferrer">
          Read more
        </a>
      </div>
    </article>
  );
};

export default NewsCard;
