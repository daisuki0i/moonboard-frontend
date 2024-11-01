<script lang="ts">
  import { goto } from "$app/navigation";
  import BlogPost from "$lib/components/blogpost.svelte";
  import { onMount } from "svelte";
  import { CapacitorHttp } from "@capacitor/core";
  import Bottomnavigation from "$lib/components/bottom-navigation.svelte";

  const goBack = () => {
    goto("/");
  };

  interface BlogPostProps {
    _id: string;
    title: string;
    description: string;
    postContent: string;
    imageUrl: string;
    author: {
      name: string;
      bio: string;
      email: string;
      imageUrl: string;
      _id: string;
    };
    tags: string[];
  }

  let posts: BlogPostProps[] = [];

  onMount(async () => {
    const options = {
      url: "http://localhost:3000/posts",
    };

    const response = await CapacitorHttp.get(options);

    posts = response.data;
    console.log("loaded posts");
  });
</script>

<div class="relative flex flex-col items-center mt-7 mb-5">
  <h1 class="font-[chonburi] text-2xl text-[#00FFFF]">MoodBoard</h1>

  <div class="p-4 grid grid-cols-1 gap-4">
    {#each posts as post}
      <BlogPost props={post} />
    {/each}
  </div>
</div>

<Bottomnavigation />