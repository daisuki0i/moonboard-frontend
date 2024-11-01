<script lang="ts">
    import Tagsbutton from "$lib/components/tagsbutton.svelte";
    
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

  export let props: BlogPostProps;
</script>

<a
  class="border-2 border-[#2E2E2E] rounded-lg p-3 flex flex-col justify-between font-b612 w-80"
  href={`/post/${props._id}`}>
  <div>
    <img
        src={props.imageUrl}
        alt="ิthis is a ima" 
        class="w-full h-[8rem] object-cover rounded-lg"
    />
    <h1 class="text-sm font-bold mt-4 italic">{props.title}</h1>
    <p class="mt-2 text-xs text-[#8E8E93]/80">{props.description}</p>
  </div>

  <div class="mt-8">
    <p class="mt-2 text-xs">by {props.author.name}</p>
    <div class="mt-2 flex flex-wrap gap-2">
      {#each props.tags as tag}
        <Tagsbutton tag={tag} />
      {/each}
    </div>
  </div>
</a>
