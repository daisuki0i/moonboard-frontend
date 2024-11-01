<script lang="ts">

  export let tag: string;

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
        return "bg-gradient-to-r from-gray-400 to-gray-600";
    }
  };
</script>

<div class="mt-1 flex flex-wrap gap-2">
  <button
    class={`text-xs px-2 py-1 rounded-lg mr-2 text-white ${getGradientForTag(tag)}`}
    on:click={() => console.log(tag)}
  >
    {tag}
  </button>
</div>
