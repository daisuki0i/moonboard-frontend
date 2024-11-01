<script lang="ts">
  export let data;
  import { CapacitorHttp } from "@capacitor/core";
  import { onMount } from "svelte";
  import { ChevronLeft, ChevronDown } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import Tagsbutton from "$lib/components/tagsbutton.svelte";
  import { Textarea } from "flowbite-svelte";
  import { Preferences } from "@capacitor/preferences";
  let textareaprops = {
    id: "message",
    name: "message",
    label: "Your message",
    rows: 4,
    placeholder: "Leave a comment...",
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

  let userData: {
    name: string;
    bio: string;
    email: string;
    imageUrl: string;
    _id: string;
    heart: string[];
  };

  let post: BlogPostProps;

  onMount(async () => {
    const options = {
      url: `https://moonboard-backend.onrender.com/posts/${data.id}`,
    };

    const response = await CapacitorHttp.get(options);

    post = response.data;
    console.log("loaded post");

    console.log(post);

    const userId = await Preferences.get({ key: "userId" });

    if (!userId.value) {
      window.location.href = "/login";
    }

    const response2 = await CapacitorHttp.get({
      url: `https://moonboard-backend.onrender.com/users/${userId.value}`,
    });
    userData = response2.data;

    // check if the post is in the user's heart
    isClicked = userData.heart.includes(post._id);
  });

  const goBack = () => {
    goto("/moonboard");
  };

  let isClicked = false;

  async function heartClickHandler() {
    const response = await CapacitorHttp.patch({
      url: `https://moonboard-backend.onrender.com/users/${userData._id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        heart: isClicked
          ? userData.heart.filter((id: string) => id !== post._id)
          : [...userData.heart, post._id],
      },
    });

    isClicked = !isClicked;
  }
</script>

<div class="relative flex flex-col items-center text-white mb-8">
  <!-- แถบย้อนกลับ -->
  <div
    class="absolute top-5 left-0 w-full flex justify-between items-center px-4 py-2"
  >
    <button on:click={goBack}
      ><ChevronLeft class="w-6 h-6 cursor-pointer" /></button
    >
  </div>
</div>

{#if post}
  <div class="flex flex-col text-center font-b612 p-6">
    <h1 class="text-base font-bold mt-4 italic">{post.title}</h1>
    <p class="mt-2 text-xs text-white/80">{post.description}</p>
    <img
      class="w-full h-[10rem] object-cover my-6"
      src={post.imageUrl}
      alt="ิthis is a ima"
    />
    <p class="mt-2 text-xs text-white/80 text-left whitespace-pre-line my-5">
      {post.postContent}
    </p>

    <div class="mt-2 flex flex-wrap gap-2 my-5">
      {#each post.tags as tag}
        <Tagsbutton {tag} />
      {/each}
    </div>

    <div class="flex flex-row my-5 justify-between">
      <a class="flex gap-x-3" href={`/user/${post.author._id}`}>
        <img
          src={post.author.imageUrl}
          referrerpolicy="no-referrer"
          alt="profile-img"
          class="rounded-full w-12 h-12"
        />
        <div class="text-xs translate-y-2">
          Written by<br />
          {post.author.name}
        </div>
      </a>

      <button
        on:click={heartClickHandler}
        class="rounded-full px-2 py-1 text-xs w-20 my-3"
        style="background-color: {isClicked
          ? '#FF66CC'
          : '#87868C'}; color: black;"
      >
        {#if isClicked}
          Hearted
        {:else}
          Heart
        {/if}
      </button>
    </div>
    <hr class="border-[#2E2E2E] my-5" />
    <Textarea
      {...textareaprops}
      class="bg-[#0B0B0B] text-white border-2 border-[#2E2E2E] resize-none"
    />
    <div class="flex justify-end">
      <button
        class="bg-[#F7FC00] text-black rounded-full px-2 py-1 text-xs w-20 my-3"
      >
        Send
      </button>
    </div>

    <div class="flex flex-row gap-x-3 my-5">
      <img
        src="/thumbnails/shiro-profile.jpeg"
        referrerpolicy="no-referrer"
        alt="profile-img"
        class="rounded-full w-12 h-12"
      />
      <class class="text-xs translate-y-2"> Tommy </class>
    </div>
    <p class="text-xs text-white/80 text-left leading-relaxed">
      This article is beautifully written, with deep emotions and vivid imagery
      that captivates the reader from start to finish. The flow of words feels
      natural, and the message resonates on a profound level, leaving a lasting
      impact.
    </p>
    <hr class="border-[#2E2E2E] my-5" />

    <div class="flex flex-row gap-x-3 my-5">
      <img
        src="/thumbnails/boy.jpeg"
        referrerpolicy="no-referrer"
        alt="profile-img"
        class="rounded-full w-12 h-12"
      />
      <class class="text-xs translate-y-2"> my boy </class>
    </div>
    <p class="text-xs text-white/80 text-left leading-relaxed">
      Your writing captures emotions so beautifully, it feels truly heartfelt.
    </p>
  </div>
{/if}
