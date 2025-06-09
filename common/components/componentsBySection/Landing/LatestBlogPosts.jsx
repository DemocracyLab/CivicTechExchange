import React, {useState, useEffect} from "react";
import { ghostApiRecent, GhostPost } from "../../utils/ghostApi.js";
import LoadingFrame from "../../chrome/LoadingFrame.jsx";
import Moment from "react-moment";

// this carousel is designed to pull from DemocracyLab's ghost blog
export default function BlogCarousel(props) {
  const [ghostPosts, setGhostPosts] = useState(null);

  useEffect(() => {
    ghostApiRecent && ghostApiRecent.browse(setGhostPosts);
  }, []);

  if (ghostPosts) {
    return (
      <>
        <h2 className="text-center LatestBlogPosts-title">Blog</h2>
        <div className="LatestBlogPosts-container">
          {ghostPosts.map(i => (
            <div key={i.slug} className="LatestBlogPosts-post">
              <img
                className="LatestBlogPosts-featureimage"
                src={i.feature_image}
                alt={i.title}
                aria-hidden="true"
              />
              <p className="LatestBlogPosts-primarytag overline">
                {i.primary_tag?.name}
              </p>
              <h3 className="LatestBlogPosts-title">{i.title}</h3>
              <p className="LatestBlogPosts-excerpt">
                {i.custom_excerpt ? i.custom_excerpt : i.excerpt}{" "}
                {
                  <a href={i.url} target="_blank">
                    Read More
                  </a>
                }
              </p>
              <div className="LatestBlogPosts-bottomrow">
                <div className="LatestBlogPosts-authorblock">
                  <img
                    className="LatestBlogPosts-author-avatar"
                    src={i.primary_author.profile_image}
                    aria-hidden="true"
                  />
                  <div className="LatestBlogPosts-postinfo overline">
                    <span className="LatestBlogPosts-author">
                      {i.primary_author.name}
                    </span>
                    <span>
                      <Moment format="D MMM YYYY">
                        {i.updated_at ? i.updated_at : i.published_at}
                      </Moment>{" "}
                      &bull; {i.reading_time} min read
                    </span>
                  </div>
                </div>
                <div className="LatestBlogPosts-link"></div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }
  return <LoadingFrame height="500px" />;
}
