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
  // https://stackoverflow.com/a/8831937
  const hashCode = str => {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      var char = str.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  // Returns an array of the provided length with numeric elements
  // in the range [0, 1). The array will be the same each time this
  // function is invoked on the same day.
  //
  // eg [0.2, 0.8, 0.4, ...]
  const getSemiRandomFactorsForToday = length => {
    const date = new Date(Date.now());
    const d = date.getDate();
    const m = date.getMonth() + 1; // JS months are zero-indexed.
    const y = date.getFullYear();
    const unit = Math.abs(hashCode(`${d}${m}${y}`)).toString();
    const unitsNeeded = Math.ceil(length / unit.length);
    const str = unit.repeat(unitsNeeded).substring(0, length);
    return str.split("").map(v => v / 10);
  }

  // Returns a semirandom "shuffled" array containing the elements in the
  // input array, ordered in a way that's stable for today.
  //
  // (Come back tomorrow for something new!)
  const shuffleForToday = inputArray => {
    const array = [...inputArray];
    const length = array.length;

    let currentIndex = length;
    let semiRandomFactors = getSemiRandomFactorsForToday(length);

    while (0 !== currentIndex) {
      const semiRandomFactor = semiRandomFactors.pop();
      const randomIndex = Math.floor(semiRandomFactor * currentIndex);
      currentIndex -= 1;

      const temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  const list = document.querySelector('.columns');
  shuffleForToday(list.children).forEach(child => list.appendChild(child));
</script>
