import { useState } from "react";
import { useAppContext } from "./../context/appContext";
import styled from "styled-components";
import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardMedia } from "@mui/material";
import Collapse from "@mui/material/Collapse";

import { BsReverseLayoutTextWindowReverse } from "react-icons/bs";
import { FaYoutube } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import ReactPlayer from "react-player";
import { SkeletonLoadingBlock } from "./UI/SkeletonLoadingBlock";

import { useMobile } from "../utils/viewportHooks";

interface anime {
  attributes: {
    titles: {
      en: string;
      en_jp: string;
      ja_jp: string;
    };
    posterImage: {
      medium: string;
      small: string;
    };
    synopsis: string;
    coverImage: string;
    averageRating: number;
    subtype: string;
    startDate: string;
    youtubeVideoId: string;
    episodeCount: number;
    format: string;
    rating: number;
    creationDate: string;
    type: string;
  };
  id: string;
  type: string;
}

interface animeProps {
  anime: anime;
  _id: string;
  title: string;
  rating: number;
  episodeCount: number;
  format: string;
  creationDate: string;
  synopsis: string;
  coverImage: string;
  description: string;
  youtube: string;
  type: string;
  japanese_title: string;
  youtubeVideoId: string;
  key: string;
}

function Anime({
  _id,
  title,
  rating,
  episodeCount,
  format,
  creationDate,
  synopsis,
  coverImage,
  anime,
  type,
  japanese_title,
  youtubeVideoId,
  key,
}: animeProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [failedToLoadYoutube, setFailedToLoadYoutube] = useState(false);
  const [ableToLoadYoutube, setAbleToLoadYoutube] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };
  const {
    createAnime,
    deleteAnime,
    siteLanguage,
    currentPlaylist,
    addToDefault,
    isLoading,
    isLoadingNonBlocking,
    loadingData,
  } = useAppContext();

  const handleSubmit = () => {
    if (isLoading || isLoadingNonBlocking) return;
    createAnime(anime, currentPlaylist.id, currentPlaylist.title);
    if (addToDefault) {
      if (currentPlaylist.id !== "0" || currentPlaylist.title !== "default") {
        createAnime(anime, "0", "default");
      }
    }
  };

  const onVideoError = () => {
    setFailedToLoadYoutube(true);
  };

  const onVideoReady = () => {
    setAbleToLoadYoutube(true);
  };

  const hasYoutubeVideoId = youtubeVideoId || anime?.attributes?.youtubeVideoId;

  const onMobile = useMobile();

  React.useEffect(() => {
    console.log("onMobile", onMobile);
  }, [onMobile]);

  if (
    isLoadingNonBlocking &&
    (loadingData?.anime_id === _id || loadingData?.anime_id === anime?.id)
  ) {
    return (
      <Wrapper>
        <SkeletonLoadingBlock
          height={onMobile ? 300 : 600}
          width={300}
          borderRadius={8}
        />
      </Wrapper>
    );
  }

  return (
    <Wrapper
      key={key + _id}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card
        variant="outlined"
        sx={{
          height: "100%",
          width: 300,
          color: "var(--textColor)",
          backgroundColor: "var(--backgroundColor)",
          marginBottom: "1rem",

          borderRadius: "10px",
          border: "1px solid var(--primary-50)",

          // get bigger on hover
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.02)",
          },
        }}
      >
        <React.Fragment>
          <CardContent
            sx={{
              backgroundColor: "var(--backgroundColor)",
              marginBottom: "0px",
              paddingBottom: "0px",
            }}
          >
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: "bold",
                color: "var(--textColor)",
                backgroundColor: "var(--backgroundColor)",
                minHeight: "75px",
                textAlign: "center",
              }}
              color="var(--textColor)"
              gutterBottom
            >
              {siteLanguage === "en"
                ? title ||
                  anime?.attributes?.titles?.en ||
                  anime?.attributes?.titles?.en_jp ||
                  "Title N/A"
                : japanese_title ||
                  anime?.attributes?.titles?.ja_jp ||
                  anime?.attributes?.titles?.en ||
                  "Title N/A"}
            </Typography>
            <div className="info-container">
              <div className="anime-img">
                {!!onMobile ? (
                  <CardMedia
                    component="img"
                    className="anime-cover-image"
                    image={
                      coverImage ||
                      anime?.attributes?.posterImage?.medium ||
                      anime?.attributes?.posterImage?.small
                    }
                    title={title}
                    sx={{
                      transition: "all 0.3s ease",
                      "&:hover": {
                        scale: "1.02",
                      },
                    }}
                  />
                ) : isHovering ? (
                  <>
                    {hasYoutubeVideoId && !failedToLoadYoutube ? (
                      <ReactPlayer
                        url={`https://www.youtube.com/watch?v=${
                          youtubeVideoId || anime?.attributes?.youtubeVideoId
                        }`}
                        width={"100%"}
                        controls={true}
                        className={"anime-cover-image"}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        fallback={
                          <CardMedia
                            component="img"
                            className="anime-cover-image"
                            image={
                              coverImage ||
                              anime?.attributes?.posterImage?.medium ||
                              anime?.attributes?.posterImage?.small
                            }
                            title={title}
                            sx={{
                              transition: "all 0.3s ease",
                              "&:hover": {
                                scale: "1.02",
                              },
                            }}
                          />
                        }
                        onError={onVideoError}
                        onReady={onVideoReady}
                      />
                    ) : (
                      <CardMedia
                        component="img"
                        className="anime-cover-image"
                        image={
                          coverImage ||
                          anime?.attributes?.posterImage?.medium ||
                          anime?.attributes?.posterImage?.small
                        }
                        title={title}
                        sx={{
                          transition: "all 0.3s ease",
                          "&:hover": {
                            scale: "1.02",
                          },
                        }}
                      />
                    )}
                  </>
                ) : (
                  <CardMedia
                    component="img"
                    className="anime-cover-image"
                    image={
                      coverImage ||
                      anime?.attributes?.posterImage?.medium ||
                      anime?.attributes?.posterImage?.small
                    }
                    title={title}
                    sx={{
                      transition: "all 0.3s ease",
                      "&:hover": {
                        scale: "1.02",
                      },
                    }}
                  />
                )}
              </div>
              <Typography sx={{ mb: 1.5 }} color="var(--textColor)">
                <Button
                  sx={{
                    color: "var(--textColor)",
                  }}
                >
                  {rating === 9001
                    ? "N/A"
                    : rating || anime?.attributes?.averageRating || "N/A"}
                  <span
                    style={{
                      color: "var(--grey-500)",
                    }}
                  >
                    /100
                  </span>
                </Button>
                <Button
                  sx={{
                    color: "var(--textColor)",
                  }}
                >
                  {format ? format : anime?.attributes?.subtype || "N/A"}
                </Button>
                <Button
                  sx={{
                    color: "var(--textColor)",
                  }}
                >
                  {creationDate
                    ? creationDate.slice(0, 4)
                    : anime?.attributes?.startDate
                    ? anime?.attributes?.startDate.slice(0, 4)
                    : "N/A"}
                </Button>
                <Button
                  sx={{
                    color: "var(--textColor)",
                  }}
                >
                  <span>
                    {episodeCount === 9001
                      ? "N/A"
                      : episodeCount ||
                        anime?.attributes?.episodeCount ||
                        "N/A"}
                  </span>
                  <span style={{ marginLeft: "5px" }}>
                    {t("anime.episode")}
                  </span>
                </Button>
                {hasYoutubeVideoId ? (
                  <Button
                    sx={{
                      color: "var(--textColor)",
                    }}
                  >
                    <a
                      href={`https://www.youtube.com/watch?v=${
                        youtubeVideoId || anime?.attributes?.youtubeVideoId
                      }`}
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      {" "}
                      <FaYoutube color="red" size={30} />{" "}
                    </a>
                  </Button>
                ) : null}
              </Typography>
            </div>
          </CardContent>
          <CardActions
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              backgroundColor: "var(--backgroundColor)",
            }}
          >
            <Button
              size="small"
              className="card-btn"
              onClick={handleModalOpen}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <BsReverseLayoutTextWindowReverse
                size={20}
                style={{
                  color: "var(--primary-500)",
                }}
              />
            </Button>
            {type === "delete" ? (
              <button
                type="button"
                className="btn delete-btn"
                onClick={() => deleteAnime(_id)}
              >
                {t("anime.delete")}
              </button>
            ) : (
              <Button
                size="small"
                className="card-btn add"
                onClick={handleSubmit}
              >
                {t("anime.add")}
              </Button>
            )}
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent
              sx={{
                backgroundColor: "var(--backgroundColor)",
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: "var(--textColor)",
                  backgroundColor: "var(--backgroundColor)",
                }}
                color="var(--textColor)"
                gutterBottom
              >
                <Button
                  sx={{
                    color: "var(--textColor)",
                  }}
                  onClick={handleModalOpen}
                >
                  {t("anime.showSynopsis")}
                </Button>
              </Typography>
            </CardContent>
          </Collapse>
        </React.Fragment>
      </Card>
      {modalOpen && (
        <Modal onClose={handleModalClose} onClick={handleModalClose}>
          <ModalContent>
            <Typography variant="h5" gutterBottom>
              {siteLanguage === "en"
                ? title ||
                  anime?.attributes?.titles?.en ||
                  anime?.attributes?.titles?.en_jp ||
                  "Title N/A"
                : japanese_title ||
                  anime?.attributes?.titles?.ja_jp ||
                  anime?.attributes?.titles?.en ||
                  "Title N/A"}
            </Typography>
            <Typography variant="body1">
              {synopsis
                ? synopsis
                : anime?.attributes?.synopsis
                ? anime?.attributes?.synopsis.replace(/<[^>]*>?/gm, "")
                : "No synopsis available"}
            </Typography>
          </ModalContent>
        </Modal>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .anime {
    padding: 2rem;
    display: flex;
    flex-direction: column;
  }

  header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--grey-100);
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    h5 {
      letter-spacing: 0;
    }
  }

  .delete-btn {
    letter-spacing: var(--letterSpacing);
    cursor: pointer;
    height: 30px;
    margin: 10px 10px 10px 10px;
    color: var(--red-dark);
    background: var(--red-light);
    align-self: center;
  }

  .anime-cover-image {
    /* height: 300px; */
    width: "100%";
  }

  @media (max-width: 1000px) {
    flex-direction: row;
    .anime-cover-image {
      height: 100px;
      width: 100px;
    }
    .info-container {
      display: flex;
      flex-direction: row;
    }
  }
`;

// Modal styles
const Modal = styled.div<{ onClose: () => void }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background-color: var(--backgroundColor);
  padding: 2rem;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  max-width: 80%;
  max-height: 80%;
  overflow-y: auto;

  h5 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--textColor);
  }

  p {
    font-size: 1rem;
    line-height: 1.5;
    color: var(--textColor);
  }
`;

export default Anime;
