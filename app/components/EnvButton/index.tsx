import {Badge} from "@mui/material";
import {publicAppEnv} from "@/app/configs/constants";
import Button from "@mui/material/Button";
import React from "react";
import {BadgeTypeMap} from "@mui/material/Badge/Badge";


type ColorProp = NonNullable<BadgeTypeMap['props']['color']>;
export default function EnvButton(
  {
    text = "API Docs",
    color = "secondary",
    link = "https://mentoroid-api-stg.geniam.com/docs/#/"
  }: {
    text?: string,
    color?: ColorProp,
    link?: string
  }
) {

  return (
    <Badge badgeContent={publicAppEnv()} color={color}>
      <a href={link}
         target='_blank'
         rel='noreferrer'
      >
        <Button>
          {text}
        </Button>
      </a>
    </Badge>
  )
}
