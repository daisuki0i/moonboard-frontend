<script lang="ts">
  import { goto } from '$app/navigation';
  import { BottomNav, BottomNavItem, Skeleton } from 'flowbite-svelte';
  import { MoonSolid, PenNibSolid, HeartSolid, UserCircleSolid } from 'flowbite-svelte-icons';

  const goToMoonboard = () => goto('/moonboard');
  const goToCreatePost = () => goto('/create-post');
  const goToHeart = () => goto('/heart');
  const goToProfile = () => goto('/profile');
</script>



<Skeleton divClass="py-4"/>
<BottomNav position="fixed" class="p-2 bottom-0 w-full" innerClass="flex justify-around space-x-4 ml-4 bg-black py-4" activeUrl="/">
  <BottomNavItem btnName="Board" on:click={goToMoonboard}>
    <MoonSolid class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500" />
  </BottomNavItem>

  <BottomNavItem btnName="Write" on:click={goToCreatePost}>
    <PenNibSolid class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500" />
  </BottomNavItem>

  <BottomNavItem btnName="Heart" on:click={goToHeart}>
    <HeartSolid class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500" />
  </BottomNavItem>

  <BottomNavItem btnName="Profile" on:click={goToProfile}>
    <UserCircleSolid class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500" />
  </BottomNavItem>
</BottomNav>


