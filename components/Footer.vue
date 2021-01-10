<template>
    <div class="main-footer">
<span class="separator">▞</span> Created by <LinkText>Gwenaël Guyot</LinkText> for CanaryTrail <span class="separator">░</span> <a href="#"><v-icon small color="primary" class="mr-2 github-btn">mdi-github</v-icon></a>
    </div>
</template>

<script>
import LinkText from '@/components/LinkText.vue';
    export default {
        components: {
            LinkText,
        },
    }
</script>

<style scoped>
.main-footer {
background-color: var(--v-secondary-base);
font-size: 0.8em;
padding: 4px 0 4px 0;
text-align: right;
color: black;
}
.separator {
    display: inline-block;
    margin: 0px 4px 0px 4px;
}
.github-btn {
transition: all .2s ease;
}
.github-btn:hover {
    transform: scale(1.2);
}
</style>