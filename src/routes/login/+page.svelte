<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import Button from "../../lib/components/button.svelte";
  import googleIcon from "../../lib/img/google_icon.svg";
  import login_ima from "../../lib/img/login_ima.gif";
  import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
  import { CapacitorHttp } from "@capacitor/core";
  import { Preferences } from '@capacitor/preferences';

  let displayedTextFirstLine = "";
  let displayedTextSecondLine = "";
  let showCursorFirstLine = false; // สำหรับควบคุมการแสดงผลของเคอร์เซอร์ในบรรทัดแรก
  let showCursorSecondLine = false; // สำหรับควบคุมการแสดงผลของเคอร์เซอร์ในบรรทัดที่สอง
  let keepCursorBlinkingFirstLine = true; // ตัวแปรควบคุมการกระพริบต่อเนื่องในบรรทัดแรก
  let keepCursorBlinkingSecondLine = true; // ตัวแปรควบคุมการกระพริบต่อเนื่องในบรรทัดที่สอง
  let showSignInButton = false; // ควบคุมการแสดงปุ่มหลังบรรทัด 2 เสร็จ

  const firstLine = "welcome to MoonBoard a sanctuary for";
  const secondLine = "souls who seek to express";
  const typingSpeed = 150; // ความเร็วในการพิมพ์
  const cursorBlinkSpeed = 600; // ความเร็วในการกระพริบของ cursor
  const pauseAfterForDuration = 1500; // เวลาหยุดหลังคำว่า "for"

  // ฟังก์ชันเริ่มการพิมพ์
  function startTyping() {
    let currentIndexFirstLine = 0;
    let currentIndexSecondLine = 0;

    showCursorFirstLine = true;
    startCursorBlinkFirstLine();

    const firstLineInterval = setInterval(() => {
      if (currentIndexFirstLine < firstLine.length) {
        displayedTextFirstLine += firstLine[currentIndexFirstLine];
        currentIndexFirstLine++;

        if (displayedTextFirstLine.endsWith("for")) {
          clearInterval(firstLineInterval);
          showCursorFirstLine = true;

          setTimeout(() => {
            keepCursorBlinkingFirstLine = false;
            showCursorFirstLine = false;

            showCursorSecondLine = true;
            startCursorBlinkSecondLine();

            const secondLineInterval = setInterval(() => {
              if (currentIndexSecondLine < secondLine.length) {
                displayedTextSecondLine += secondLine[currentIndexSecondLine];
                currentIndexSecondLine++;

                if (displayedTextSecondLine.endsWith("express")) {
                  clearInterval(secondLineInterval);
                  setTimeout(() => {
                    keepCursorBlinkingSecondLine = false;
                    showCursorSecondLine = false;
                    showSignInButton = true;
                  }, 3000);
                }
              }
            }, typingSpeed);
          }, pauseAfterForDuration);
        }
      }
    }, typingSpeed);
  }

  // ฟังก์ชันกระพริบ cursor บรรทัดแรก
  function startCursorBlinkFirstLine() {
    const cursorBlinkInterval = setInterval(() => {
      if (!keepCursorBlinkingFirstLine) {
        clearInterval(cursorBlinkInterval);
      } else {
        showCursorFirstLine = !showCursorFirstLine;
      }
    }, cursorBlinkSpeed);
  }

  // ฟังก์ชันกระพริบ cursor บรรทัดที่สอง
  function startCursorBlinkSecondLine() {
    const cursorBlinkInterval = setInterval(() => {
      if (!keepCursorBlinkingSecondLine) {
        clearInterval(cursorBlinkInterval);
      } else {
        showCursorSecondLine = !showCursorSecondLine;
      }
    }, cursorBlinkSpeed);
  }

  // เรียก startTyping เมื่อ component แสดงผล
  onMount(() => {
    startTyping();
    GoogleAuth.initialize();
  });

  // ฟังก์ชันเรียกใช้งาน Google Sign-in
  async function signInWithGoogle() {
    try {
      const googleUser = await GoogleAuth.signIn();
      console.log(googleUser);

      // ส่งข้อมูลไปยัง API ของเรา
      const response = await CapacitorHttp.post({
        url: "https://moonboard-backend.onrender.com/login",
        data: googleUser,
        headers: {
          "Content-Type": "application/json",
        },
      });

      await Preferences.set({
        key: "userId",
        value: response.data._id,
      });
      // localStorage.setItem("userId", response.data._id);

      window.location.href = "/moonboard";
    } catch (error) {
      console.error(error);
    }
  }
</script>

<div class="flex flex-col justify-center items-center h-screen -mt-11">
  <!-- รูป GIF Login -->
  <img src={login_ima} alt="Login" class="w-64 h-64 object-cover" />

  <!-- ข้อความที่พิมพ์พร้อมเคอร์เซอร์ -->
  <div class="text-white text-center -mt-8">
    <p class="font-b612 text-xs">
      {displayedTextFirstLine}{showCursorFirstLine ? "|" : ""}
    </p>
    <p class="font-b612 text-xs">
      {displayedTextSecondLine}{showCursorSecondLine ? "|" : ""}
    </p>
  </div>
</div>

<!-- ปุ่ม Google Sign-in -->
{#if showSignInButton}
  <section class="flex justify-center" transition:fade>
    <div class="fixed bottom-11">
      <Button on:click={signInWithGoogle}>
        <img src={googleIcon} alt="Google icon" class="w-5 h-5 mr-4" />
        Sign in with Google
      </Button>
    </div>
  </section>
{/if}
