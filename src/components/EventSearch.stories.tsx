//@ts-nocheck
import { storiesOf } from "@storybook/react";
import React from "react";
import { start } from "repl";
import { withKnobs, optionsKnob as options } from "@storybook/addon-knobs";
import EventSearch from "./EventSearch.tsx";

const stories = storiesOf("Provenance Search", module);
stories.addDecorator(withKnobs);

stories.add("small", () => <EventSearch></EventSearch>);
