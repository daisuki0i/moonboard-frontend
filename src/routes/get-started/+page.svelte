<script lang="ts">
    import Button from "../../lib/components/button.svelte";
    import { goto } from '$app/navigation';

    const navigateToLogin = () => {
        goto('/login');
    };
</script>

<div class="flex flex-col justify-center items-center container p-8">
    <!-- ข้อความ -->
    <div class="text-center flex flex-col gap-y-4">
        <p class="text-6xl font-[chonburi] text-[#F7FC00]">mood</p>
        <p class="text-6xl font-[citypop] text-[#F7FC00]">Board</p>
    </div>

    <!-- ปุ่ม Continue ที่ด้านล่าง -->
    <div class="fixed bottom-11">
        <Button on:click={navigateToLogin}>Continue</Button>
    </div>
</div>

<style>
    .container {
        background-image: url("/BG_GetStarted.gif");
        background-size: cover;
        background-position: center;
        height: 100dvh;
    }
</style>




