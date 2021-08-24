{% extends '_layout.swig' %}
{% import '_macro/post-collapse.swig' as post_template %}
{% import '_macro/sidebar.swig' as sidebar_template %}

{% block title %}{{ page.title }} | {{ config.title }}{% endblock %}

{% block content %}

  {######################}
  {### IDEA BLOCK ###}
  {######################}

  <div class="post-block idea">
    <header class="post-header" style="opacity: 1;display: block;transform: translateY(0px);margin-bottom: 45px;">
      <h1 class="post-title" itemprop="name headline" style="text-align: center;">灵感和归纳</h1>
    </header>
    <HR style="FILTER: alpha(opacity=100,finishopacity=0,style=1)" color=#d4d4d4 SIZE=3>
    {% set list = site.posts.sort('date', -1) %}
    {% for post in list %}
      {% set stav = post.content.indexOf('<!-- summary_start -->') %}
      {% set endv = post.content.indexOf('<!-- summary_end -->') %}
      {% if stav != -1 %}
        {% set stav = stav + 22 %}
      {% else %}
        {% set stav = post.content.indexOf('<h1 id="Summary"><a href="#Summary" class="headerlink" title="Summary"></a>Summary</h1><p>') %}
        {% if stav != -1 %}
          {% set stav = stav + 90 %}
        {% endif %}
      {% endif %}
      {% if endv == -1 %}
        {% set endv = post.content.indexOf('<h1 id="Code">') %}
      {% endif %}
      {% if stav != -1 and endv != -1 %}
        {{ post.content.substring(stav, endv) }}
        <p style="text-align: right; margin-right: 30px">——<a href={{ post.permalink }}>{{ post.date.format('YYYY-MM-DD') }} {{ post.title }}</a></p>
				<HR style="FILTER: alpha(opacity=100,finishopacity=0,style=1)" color=#d4d4d4 SIZE=3>
      {% endif %}
    {% endfor %}
  </div>
  {##########################}
  {### END IDEA BLOCK ###}
  {##########################}

{% endblock %}

{% block sidebar %}
  {{ sidebar_template.render(false) }}
{% endblock %}
