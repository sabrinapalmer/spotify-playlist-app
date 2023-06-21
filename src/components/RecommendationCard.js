import React, { useEffect, useState } from "react";
import {
  Icon,
  Slider,
  Select,
  MenuItem,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from "@material-ui/core";
import AudioPlayer from "react-audio-player";

function RecommendationCard(props) {
  const { track, onSelectTrack } = props;

  const handleCardClick = () => {
    onSelectTrack(track.id);
  };
  return (
    <div>
      <Card
        onClick={handleCardClick}
        style={{
          width: "200px",
          margin: "10px",
          flexShrink: 0,
          outline: props.isSelected ? "2px solid #8A2BE2" : "none",
        }}
        key={track.id}
      >
        <CardMedia
          component="img"
          alt={track.album.name}
          height="200"
          image={track.album.images[0].url}
        />
        <CardContent>
          <Typography variant="body2" component="p">
            {track.name}
          </Typography>
          <Typography color="textSecondary" variant="caption" component="p">
            {track.artists.map((artist) => artist.name).join(", ")}
          </Typography>
          {track.preview_url && (
            <AudioPlayer
              src={track.preview_url}
              controls
              style={{ width: "100%" }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default RecommendationCard;
