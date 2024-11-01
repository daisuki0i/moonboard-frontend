<script lang="ts">
  import { CapacitorHttp } from "@capacitor/core";
  import { Preferences } from "@capacitor/preferences";
  import { onMount } from "svelte";
  import { ChevronLeft } from "lucide-svelte";
  import Bottomnavigation from "$lib/components/bottom-navigation.svelte";
  import BlogPost from "$lib/components/blogpost.svelte";

  export let data;
  let userData: {
    name: string;
    bio: string;
    email: string;
    imageUrl: string;
    _id: string;
    followers: number;
  };

  let posts: {
    _id: string;
    title: string;
    description: string;
    postContent: string;
    imageUrl: string;
    tags: string[];
    author: User;
  }[] = [];

  interface User {
    name: string;
    bio: string;
    email: string;
    imageUrl: string;
    _id: string;
  }

  let followers = 0;
  let following = 0;
  let isFollowing = false; // ตัวแปรสถานะสำหรับการติดตามผู้ใช้


  onMount(async () => {
    const userId = await Preferences.get({ key: "userId" });
    if (!userId.value) {
      window.location.href = "/login";
    }

    if (data.id === userId.value) {
      window.location.href = "/profile";
    }

    const response = await CapacitorHttp.get({
      url: `http://localhost:3000/users/${data.id}`,
    });

    userData = response.data;
    followers = userData.followers || 0; // กำหนดจำนวนผู้ติดตามเริ่มต้น
    console.log(userData);

    const postResponse = await CapacitorHttp.get({
      url: "http://localhost:3000/posts",
    });

    posts = postResponse.data;

    // filter posts by user id
    posts = posts.filter((post) => post.author._id === data.id);

    console.log(posts);
  });

  function goBack() {
    window.history.back();
  }

  function toggleFollow() {
    isFollowing = !isFollowing; // เปลี่ยนสถานะเมื่อกดปุ่ม
    followers += isFollowing ? 1 : -1; // เพิ่มหรือลดจำนวนผู้ติดตาม
    // สามารถเพิ่มโค้ดเพื่อบันทึกสถานะไปที่ backend ได้ หากต้องการ
  }
</script>

<div class="relative flex flex-col items-center text-white mb-8">
  <div
    class="absolute top-5 left-0 w-full flex justify-between items-center px-4 py-2"
  >
    <button on:click={goBack}
      ><ChevronLeft class="w-6 h-6 cursor-pointer" /></button
    >
  </div>
</div>

{#if userData}
  <div class="flex flex-col">
    <div class="flex space-x-4 rtl:space-x-reverse p-6 mt-7">
      <div class="flex flex-col gap-y-3">
        <img
          src={userData.imageUrl}
          referrerpolicy="no-referrer"
          alt="profile-img"
          class="rounded-full w-20 h-20"
        />
        <div class="font-medium dark:text-white">
          <div>{userData.name}</div>
        </div>
      </div>

      <div class="font-medium dark:text-white text-center">
        <div class="flex justify-center space-x-12 ml-7 items-center">
          <div>
            <p>{followers}<br />followers</p>
          </div>
          <div>
            <p>{following}<br />following</p>
          </div>
        </div>

        <!-- ปุ่ม Follow / Following -->
        <button
          class="mt-2 w-48 ml-6 h-9"
          style="background-color: #F7FC00; color: black; border-radius: 0.5rem;"
          on:click={toggleFollow}
        >
          {#if isFollowing}
            Following
          {:else}
            Follow
          {/if}
        </button>
      </div>
    </div>

    <div class="text-sm text-gray-500 dark:text-gray-400 px-6 -translate-y-5">
      {userData.bio}
    </div>
  </div>

  <hr class="border-[#2E2E2E] my-2" />
  
  <div class="relative flex flex-col items-center mt-2 mb-5">
    <div class="p-4 grid grid-cols-1 gap-4">
      {#each posts as post}
        <BlogPost props={post} />
      {/each}
    </div>
  </div>

{/if}
<Bottomnavigation />