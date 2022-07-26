---
title: Posts
layout: note
---

<h3 id="post-header">Posts</h3>

<ul id="post-list">
    {% for post in site.posts %}
        <li class="{% for tag in post.tags %}{{ tag | slugify }} {% endfor %}">
            <a href="{{ post.url }}">
                {{ post.title }}
            </a>
        </li>
    {% endfor %}
</ul>

<h3>Tags</h3>

<ul id="tag-list">
    <li>
        <a href="/posts/">
            all
        </a>
    </li>
    {% for tag in site.tags %}
        <li class="{{ tag[0] | slugify }}">
            <a href="/posts/?tag={{ tag[0] | slugify }}">
                {{ tag[0] }}
            </a>
        </li>
    {% endfor %}
</ul>
<script>
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
const tag = params.tag;
if (tag) {
    const listEl = document.getElementById("post-list");
    const itemEls = listEl.children;
    for (let i = 0; i < itemEls.length; i++) {
        const itemEl = itemEls[i];
        if (!itemEl.className.includes(tag)) {
            itemEl.classList.add("hidden");
        }
    }
    const headerEl = document.getElementById("post-header");
    headerEl.textContent = `Posts tagged "${tag.replaceAll("-", " ")}"`;
}
</script>
