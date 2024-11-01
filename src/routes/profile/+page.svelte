<script lang="ts">
  import { onMount } from "svelte";
  import { CapacitorHttp } from "@capacitor/core";
  import { Preferences } from "@capacitor/preferences";
  import Bottomnavigation from "$lib/components/bottom-navigation.svelte";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import BlogPost from "$lib/components/blogpost.svelte";

  interface User {
    name: string;
    bio: string;
    email: string;
    imageUrl: string;
    _id: string;
  }

  let userData: User;

  let bioChange: string;
  let nameChange: string;
  let isDialogOpen = false; // ควบคุมสถานะของ Dialog
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
    bioChange = userData.bio;
    nameChange = userData.name;

    const postResponse = await CapacitorHttp.get({
      url: "http://localhost:3000/posts",
    });

    posts = postResponse.data;

    // filter posts by user id
    posts = posts.filter((post) => post.author._id === userId.value);

    console.log(posts);
  });

  const saveChanges = async () => {
    try {
      const response = await CapacitorHttp.patch({
        url: `http://localhost:3000/users/${userData._id}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          bio: bioChange,
          name: nameChange,
        },
      });
      console.log(response.data);

      userData.bio = bioChange;
      userData.name = nameChange;
      isDialogOpen = false; // ปิด Dialog หลังจากบันทึกข้อมูลสำเร็จ
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  let followers = 0;
  let following = 0;
</script>

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

        <!-- เพิ่มระยะห่างด้านบน -->
        <Dialog.Root bind:open={isDialogOpen}>
          <Dialog.Trigger
            on:click={() => (isDialogOpen = true)}
            class={`mt-2 w-48 ml-6 ${buttonVariants({ variant: "outline" })}`}
            style="background-color: #F7FC00; color: black; border-radius: 0.5rem;"
          >
            Edit Profile
          </Dialog.Trigger>
          <Dialog.Content class="sm:max-w-[425px]">
            <Dialog.Header>
              <Dialog.Title>Edit profile</Dialog.Title>
              <Dialog.Description>
                Make changes to your profile here. Click save when you're done.
              </Dialog.Description>
            </Dialog.Header>
            <div>
              <img
                src={userData.imageUrl}
                referrerpolicy="no-referrer"
                alt="profile-img"
                class="rounded-full w-20 h-20 mx-auto"
              />
            </div>
            <div class="grid gap-4 py-4">
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="name" class="text-right">Name</Label>
                <Input id="name" bind:value={nameChange} class="col-span-3" />
              </div>
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="bio" class="text-right">Bio</Label>
                <textarea
                  id="bio"
                  bind:value={bioChange}
                  class="col-span-3 h-24 border border-gray-300 rounded-md p-2 bg-[#0b0b0b] text-white"
                ></textarea>
              </div>
            </div>
            <Dialog.Footer>
              <Button
                type="submit"
                on:click={saveChanges}
                class="bg-[#F7FC00] text-black"
              >
                Save changes
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
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
