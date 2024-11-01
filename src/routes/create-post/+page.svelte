<script lang="ts">
  import { Dropzone } from "flowbite-svelte";
  import { Button, Dropdown, Checkbox, Helper } from "flowbite-svelte";
  import { ChevronLeft, ChevronDown } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import { writable } from "svelte/store";
  import { CapacitorHttp } from "@capacitor/core";
  import { Preferences } from '@capacitor/preferences';

  let value: string[] = [];
  let title = "";
  let description = "";
  let postContent = ""; // ข้อความของโพสต์
  let imageUrl = ""; // เก็บ URL ของรูปที่อัปโหลด
  let imageBase64 = ""; // เก็บรูปในรูปแบบ Base64

  const maxTitleLength = 60;
  const maxDescriptionLength = 150;
  const maxNewlinesTitle = 1;
  const maxNewlinesDescription = 3;

  let selectedTags = writable<string[]>([]);
  const maxSelectableTags = 4;

  const handleTagSelection = (tag: string) => {
    selectedTags.update((tags) => {
      if (tags.includes(tag)) {
        return tags.filter((t) => t !== tag);
      } else if (tags.length < maxSelectableTags) {
        return [...tags, tag];
      }
      return tags;
    });
  };

  const getGradientForTag = (tag: string) => {
    switch (tag) {
      case "#SoulQuest":
        return "bg-gradient-to-r from-[#FF6B81] to-[#1ABC9C]";
      case "#EchoesWithin":
        return "bg-gradient-to-r from-[#AF52DE] to-[#20B2AA]";
      case "#MidnightMuse":
        return "bg-gradient-to-r from-[#5856D6] to-[#F0D35F]";
      case "#SilentWhispers":
        return "bg-gradient-to-r from-[#FF4757] to-[#2D98DA]";
      case "#VelvetDreams":
        return "bg-gradient-to-r from-[#8E44AD] to-[#F1C40F]";
      case "#EchoChamber":
        return "bg-gradient-to-r from-[#007AFF] to-[#FF4C6E]";
      case "#FadedMemories":
        return "bg-gradient-to-r from-[#F08080] to-[#6DA9CE]";
      case "#CelestialMind":
        return "bg-gradient-to-r from-[#64D2FF] to-[#A1EF82]";
      case "#ShatteredHopes":
        return "bg-gradient-to-r from-[#B24592] to-[#3A1C71]";
      case "#NeonNostalgia":
        return "bg-gradient-to-r from-[#FFD60A] to-[#FF7DF6]";
      default:
        return "bg-gray-700";
    }
  };

  const goBack = () => {
    goto("/moonboard");
  };

  const dropHandle = (event: DragEvent) => {
    value = [];
    event.preventDefault();
    if (event.dataTransfer?.items) {
      [...event.dataTransfer.items].forEach((item) => {
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) {
            value.push(file.name);
            imageUrl = URL.createObjectURL(file); // แปลงไฟล์รูปเป็น URL
          }
        }
      });
    } else if (event.dataTransfer?.files) {
      [...event.dataTransfer.files].forEach((file) => {
        value.push(file.name);
        imageUrl = URL.createObjectURL(file); // แปลงไฟล์รูปเป็น URL
      });
    }
  };

  const handleChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      value.push(files[0].name);
      imageUrl = URL.createObjectURL(files[0]); // แปลงไฟล์รูปเป็น URL

      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        imageBase64 = reader.result as string;
      };
    }
  };

  const handleTitleInput = (event: KeyboardEvent) => {
    const textarea = event.target as HTMLTextAreaElement;
    const currentText = textarea.value;
    const newlinesCount = (currentText.match(/\n/g) || []).length;

    if (event.key === "Enter" && newlinesCount >= maxNewlinesTitle) {
      event.preventDefault();
    }
  };

  const handleDescriptionInput = (event: KeyboardEvent) => {
    const textarea = event.target as HTMLTextAreaElement;
    const currentText = textarea.value;
    const newlinesCount = (currentText.match(/\n/g) || []).length;

    if (event.key === "Enter" && newlinesCount >= maxNewlinesDescription) {
      event.preventDefault();
    }

    // auto resize textarea
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handlePost = async () => {
    if (
      !title ||
      !description ||
      !postContent ||
      !imageBase64 ||
      $selectedTags.length === 0
    ) {
      alert("Please fill in all fields");
      return;
    }

    const userId = await Preferences.get({ key: "userId" });
    const postData = {
      title: title,
      description: description,
      postContent: postContent,
      image: imageBase64,
      tags: $selectedTags,
      userId: userId.value,
    };

    const response = await CapacitorHttp.post({
      url: "https://moonboard-backend.onrender.com/post",
      data: postData,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // ปริ้นข้อมูลทั้งหมดในคอนโซล
    console.log("Post Data: ", postData);

    // นำทางไปที่หน้า moonboard หลังจากโพสต์สำเร็จ
    goBack();
  };

  const tags = [
    { label: "#SoulQuest", colors: "from-[#FF6B81] to-[#1ABC9C]", description: "The journey to find life's true meaning" },
    { label: "#EchoesWithin", colors: "from-[#AF52DE] to-[#20B2AA]", description: "Echoes of a soul hidden deep within" },
    { label: "#MidnightMuse", colors: "from-[#5856D6] to-[#F0D35F]", description: "Inspiration that shimmers beneath the stars" },
    { label: "#SilentWhispers", colors: "from-[#FF4757] to-[#2D98DA]", description: "Soft whispers of feelings left unspoken" },
    { label: "#VelvetDreams", colors: "from-[#8E44AD] to-[#F1C40F]", description: "Soft dreams floating through vivid imagination" },
    { label: "#EchoChamber", colors: "from-[#007AFF] to-[#FF4C6E]", description: "Reflections of self and voices of society" },
    { label: "#FadedMemories", colors: "from-[#F08080] to-[#6DA9CE]", description: "Memories fading with the passage of time" },
    { label: "#CelestialMind", colors: "from-[#64D2FF] to-[#A1EF82]", description: "Tranquility and depth beneath an endless sky" },
    { label: "#ShatteredHopes", colors: "from-[#B24592] to-[#3A1C71]", description: "Fragments of broken hope and lingering pain" },
    { label: "#NeonNostalgia", colors: "from-[#FFD60A] to-[#FF7DF6]", description: "Bittersweet memories of the glowing 80s" },
  ];
</script>

<div class="relative flex flex-col items-center text-white">
  <!-- แถบย้อนกลับและปุ่ม Post -->
  <div class="absolute top-5 left-0 w-full flex justify-between items-center px-4 py-2">
    <button on:click={goBack}><ChevronLeft class="w-6 h-6 cursor-pointer" /></button>
    <Button on:click={handlePost}>Post</Button>
  </div>

  <!-- Dropzone สำหรับอัปโหลดรูป -->
  <Dropzone
    class="mt-20 mb-4 w-[21rem] h-40 px-6 border border-gray-400 border-dashed rounded-lg relative"
    id="dropzone"
    on:drop={dropHandle}
    on:dragover={(event) => event.preventDefault()}
    on:change={handleChange}
  >
    {#if imageUrl}
      <img src={imageUrl} alt="Uploaded Img" class="absolute inset-0 w-full h-full object-cover rounded-lg" />
    {:else}
      <svg aria-hidden="true" class="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
        <span class="font-semibold">Click to upload</span> or drag and drop
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
    {/if}
  </Dropzone>

  <!-- ช่องกรอกข้อมูล -->
  <div class="w-full h-full px-6">
    <!-- Textarea สำหรับ Write a Title -->
    <textarea
      placeholder="Write a Title ..."
      class="w-full text-white bg-transparent outline-none resize-none mt-4"
      bind:value={title}
      maxlength={maxTitleLength}
      rows="2"
      on:keydown={handleTitleInput}
      style="overflow: hidden;"
    ></textarea>
    <p class="text-right text-[#8E8E93] text-[10px]">{title.length}/{maxTitleLength}</p>
    <hr class="border-[#2E2E2E] my-2" />

    <!-- Textarea สำหรับ Write a Description -->
    <textarea
      placeholder="Write a Description ..."
      class="w-full text-white bg-transparent outline-none resize-none my-2"
      bind:value={description}
      maxlength={maxDescriptionLength}
      rows="4"
      on:keydown={handleDescriptionInput}
      style="overflow: hidden;"
    ></textarea>
    <p class="text-right text-[#8E8E93] text-[10px]">{description.length}/{maxDescriptionLength}</p>
    <hr class="border-[#2E2E2E] my-2" />

    <!-- ปุ่มเลือกแท็กและแสดงแท็ก -->
    <div class="flex items-center justify-between w-full mb-2">
      <h3 class="text-white my-2">Selected Tag:</h3>
      <Button class="inline-flex"><ChevronDown class="w-6 h-6 ms-2 text-white dark:text-white" /></Button>
    </div>

    <Dropdown class="w-96 p-3 space-y-1 text-sm bg-[#0B0B0B] max-h-48">
      {#each tags as tag (tag)}
        <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
          <Checkbox
            checked={$selectedTags.includes(tag.label)}
            on:change={() => handleTagSelection(tag.label)}
            disabled={$selectedTags.length >= maxSelectableTags && !$selectedTags.includes(tag.label)}
          >
            <span class="bg-gradient-to-r {tag.colors} bg-clip-text text-transparent ml-4">{tag.label}</span>
          </Checkbox>
          <Helper class="ps-6">{tag.description}</Helper>
        </li>
      {/each}
    </Dropdown>

    <!-- แสดงแท็กที่เลือกแล้ว -->
    <div class="border border-gray-500 rounded-lg p-2 mb-2">
      <h3 class="text-[#8E8E93]">Tags:</h3>
      <div class="flex flex-wrap">
        {#each $selectedTags as tag (tag)}
          <span class="{getGradientForTag(tag)} text-white rounded-full px-2 py-1 m-1 text-sm">{tag}</span>
        {/each}
      </div>
    </div>
    <hr class="border-[#2E2E2E] my-6" />

    <!-- พื้นที่ให้เขียนบทความ -->
    <textarea
      placeholder="Write a Post ..."
      class="w-full text-white bg-transparent outline-none resize-none min-h-48 overflow-hidden mb-4"
      bind:value={postContent}
      on:keydown={handleDescriptionInput}
    ></textarea>
  </div>
</div>

<style>
  input[type="file"]#dropzone {
    display: none;
  }

  .text-small {
    font-size: 0.75rem; /* ลดขนาดฟอนต์เป็น 12px */
  }
</style>
