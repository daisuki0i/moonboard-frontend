<script lang="ts">
  import { goto } from "$app/navigation";
  import Bottomnavigation from "$lib/components/bottom-navigation.svelte";
  import { CapacitorHttp } from "@capacitor/core";
  import { Preferences } from "@capacitor/preferences";
  import { onMount } from "svelte";
  import BlogPost from "$lib/components/blogpost.svelte";

  interface User {
    name: string;
    bio: string;
    email: string;
    imageUrl: string;
    _id: string;
    heart: string[];
  }

  let userData: User;
  let posts: {
    _id: string;
    title: string;
    description: string;
    postContent: string;
    imageUrl: string;
    tags: string[];
    author: User;
  }[] = [];

  onMount(async () => {
    const userId = await Preferences.get({ key: "userId" });

    if (!userId.value) {
      window.location.href = "/login";
    }

    const response = await CapacitorHttp.get({
      url: `http://localhost:3000/users/${userId.value}`,
    });

    userData = response.data;

    const postResponse = await CapacitorHttp.get({
      url: "http://localhost:3000/posts",
    });

    posts = postResponse.data;

    // filter posts by user id
    posts = posts.filter((post) => userData.heart.includes(post._id));

    console.log(posts);
  });
</script>

{#if userData}
<div class="relative flex flex-col items-center mt-7 mb-5">
    <h1 class="font-[chonburi] text-2xl text-[#00FFFF]">Hearts</h1>
  
    <div class="p-4 grid grid-cols-1 gap-4">
      {#each posts as post}
        <BlogPost props={post} />
      {/each}
    </div>
  </div>
{/if}

<Bottomnavigation />
