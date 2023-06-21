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

function RecommendationCard(props) {
  const { track } = props;
  return (
    <div>
      <Card
        key={track.id}
        style={{
          width: "200px",
          margin: "10px",
          flexShrink: 0,
        }}
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
        </CardContent>
      </Card>
    </div>
  );
}

export default RecommendationCard;
