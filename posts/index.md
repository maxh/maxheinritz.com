---
title: Posts
layout: default
---

<h1 id="post-title">{{page.title}}</h1>

<div>
  {% assign posts_by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
  {% for year_group in posts_by_year %}
      {% assign unique_tags = "" %}
    {% for post in year_group.items %}
      {% for tag in post.tags %}
        {% unless unique_tags contains tag %}
          {% assign unique_tags = unique_tags | append: tag | append: " " %}
        {% endunless %}
      {% endfor %}
    {% endfor %}
    <div class="post-wrapper {% for tag in unique_tags | split: ' ' %}{{ tag | slugify }} {% endfor %}">
    <h2>{{ year_group.name }}</h2>
    <ul class="post-list">
    {% for post in year_group.items %}
      <li class="{% for tag in post.tags %}{{ tag | slugify }} {% endfor %}">
        <a href="{{ post.url }}">
          {{ post.title }}
        </a>
      </li>
    {% endfor %}
    </ul>
    </div>
  {% endfor %}
</div>

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

<h3>Other writing</h3>

- [Isolating Rails Engines with RuboCop](https://flexport.engineering/isolating-rails-engines-with-rubocop-210feaba3164)
- [React Native and Expo at Flexport](https://flexport.engineering/react-native-and-expo-at-flexport-5f4842b2ba20)
- [Approximating “Prettier for Ruby” with RuboCop](https://flexport.engineering/approximating-prettier-for-ruby-with-rubocop-8b863bd64dc6)

<script>
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
const tag = params.tag;
if (tag) {
    const listEls = document.querySelectorAll(".post-wrapper");
    console.log(listEls)
    for (const listEl of listEls) {
        if (!listEl.className.includes(tag)) {
            listEl.classList.add("hidden");
            continue;
        }
        const itemEls = listEl.querySelector('.post-list').children;
        for (let i = 0; i < itemEls.length; i++) {
            const itemEl = itemEls[i];
            if (!itemEl.className.includes(tag)) {
                itemEl.classList.add("hidden");
            }
        }
    }
    const headerEl = document.getElementById("post-title");
    headerEl.textContent = `Posts tagged "${tag.replaceAll("-", " ")}"`;
}
</script>
