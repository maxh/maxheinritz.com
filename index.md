---
layout: default
class: home
---

<div class="columns">
  {% for project in site.projects %}
    {% if project.title != "Fox Mask" %}
      <a href="{{ project.url }}">
        <div class="pin">
          <img src="/images/{{ project.images.first }}">
        </div>
      </a>
    {% endif %}
  {% endfor %}
</div>

**Essays**

{% for essay in site.essays %}
  - <a href="{{ essay.url }}">{{ essay.title }}</a>
{% endfor %}

**Code etc**

- [Isolating Rails Engines with RuboCop](https://flexport.engineering/isolating-rails-engines-with-rubocop-210feaba3164)
- [React Native and Expo at Flexport](https://flexport.engineering/react-native-and-expo-at-flexport-5f4842b2ba20)
- [Approximating “Prettier for Ruby” with RuboCop](https://flexport.engineering/approximating-prettier-for-ruby-with-rubocop-8b863bd64dc6)
- [Earth Engine layer framework](https://github.com/google/earthengine-api/commit/7110809ce760ab187afa43cb20e349e54b0f62b3#diff-85588e2d3225963a73d9cf4e21bdf240)

**Misc related internets**

- [faircompanies apartment tour](https://www.youtube.com/watch?v=6tYaI3At4fs)
- [Uses This interview](https://usesthis.com/interviews/max.heinritz/)
- [Built In interview](https://builtin.com/software-engineering-perspectives/how-to-become-a-software-engineer)

<!-- Randomize the order of the project pictures -- just for fun! -->
<script>
  const root = document.querySelector('.columns');
  shuffleForToday(root.children).forEach(child => root.appendChild(child));
</script>
