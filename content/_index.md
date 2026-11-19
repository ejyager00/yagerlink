---
title: "Eric Yager"
# Profile settings
profileImage: "images/img-512.webp"    # path under static/
previewImage: "images/og.jpg"          # link-preview image (JPG for LinkedIn etc.)
name: "Eric Yager"
description: "👨‍💻 Software engineer  📍Carmel, IN"
seoDescription: "Eric Yager is a senior software engineer in Indiana with interests in DevOps, serverless architectures, and AI-enabled development."  # search results & link previews
socials:
  # svg: name of an icon partial in layouts/partials/icons/
  - url: "https://github.com/ejyager00"
    svg: "github"
    label: "GitHub"
  - url: "https://git.yager.me/explore"
    svg: "forgejo"
    label: "Forgejo"
    sameAs: false         # a site index, not a profile; omit from structured data
  - url: "https://linkedin.com/in/eric-yager"
    svg: "linkedin"
    label: "LinkedIn"
  # - url: "https://x.com/EricYager4"
  #   svg: "x-twitter"
  #   label: "X"
  - url: "https://instagram.com/eric_yager"
    svg: "instagram"
    label: "Instagram"
  - url: "https://ericyager.com"
    svg: "globe"
    label: "Website"
  - url: "https://orcid.org/0000-0002-3691-7801"
    svg: "orcid"
    label: "ORCID"

# Extra profiles for structured data only (not shown as icons)
sameAs:
  - "https://x.com/EricYager4"

# You can add as many links as you want!

# Link cards
# NOTE: link-card.html (theme) renders `icon` as a Font Awesome <i> class, but Font Awesome
# is no longer loaded. Before enabling, override it to use layouts/partials/icons/ like profile.html.
# links:
#   - href: "https://orcid.org/0000-0002-3691-7801"
#     icon: "fab fa-orcid"
#     title: "ORCID"
#     description: "See my research projects"

# NOTE: spotify-playlist.html (theme) uses a Font Awesome icon (fa-spotify), which is no longer
# loaded. Before enabling, override it with an SVG partial from layouts/partials/icons/.
# Spotify playlist embed. You can add embed by rigth clicking on your spotify playlist -> Share -> Copy embed. After copying the embed, replace it with the iframe below.
# spotifyPlaylist:
#   iframe: '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/6zcsSLDrLiCpX8KDzNiIhS?utm_source=generator" width="100%" height="152" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>'

#  REMOVE "How to Customize This Page" section by removing the line "{{ partial "Instructions.html" . }}" in index.html file under layouts/


# About section (optional section)

# about:
#   title: "About Me"
#   sections:
#     - heading: "Professional Background"
#       content: "I'm a full-stack developer with 5+ years of experience building web applications. Specialized in JavaScript frameworks and cloud architecture."
#     # - heading: "Current Focus"
#     #   content: "Currently working on open-source tools to improve developer productivity and accessibility in web development."
#     # - heading: "Personal Interests"
#     #   content: "When not coding, I enjoy photography, hiking, and contributing to local tech communities through mentorship programs."
---