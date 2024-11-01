<script lang="ts">
    import Button from "./ui/button/button.svelte";
</script>

<Button class="bg-[#F7FC00] hover:bg-[#CFD300] rounded-xl w-64" on:click>
    <slot></slot>
</Button>