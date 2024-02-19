import {
  ISbStories,
  ISbStoriesParams,
  getStoryblokApi,
  apiPlugin,
  storyblokInit,
  ISbStory,
  StoryblokClient,
} from "@storyblok/react";
import { components } from "@/components";

export function initStoryblok(accessToken?: string) {
  storyblokInit({
    accessToken,
    use: [apiPlugin],
    components,
  });
}

let lastContentVersion: number | undefined = undefined;

export const sbParams = (
  draft: boolean,
  params: ISbStoriesParams = {}
): ISbStoriesParams => ({
  version: draft ? "draft" : "published",
  cv: lastContentVersion,
  resolve_links: "url",
  ...params,
});

export async function fetchStory(
  slug: string,
  previewStoryblokApi?: StoryblokClient
) {
  const storyblokApi = previewStoryblokApi || getStoryblokApi();
  const response: ISbStory = await storyblokApi.get(
    `cdn/stories/${slug}`,
    sbParams(!!previewStoryblokApi)
  );

  lastContentVersion = response.data.cv;
  return response;
}

// TODO: https://www.storyblok.com/docs/api/content-delivery/v2#topics/pagination
export async function fetchStories(
  params?: ISbStoriesParams,
  previewStoryblokApi?: StoryblokClient
) {
  const storyblokApi = previewStoryblokApi || getStoryblokApi();
  const response: ISbStories = await storyblokApi.get(
    `cdn/stories`,
    sbParams(!!previewStoryblokApi, params)
  );

  lastContentVersion = response.data.cv;
  return response;
}
