# Copy to demo server
rsync --filter="- .git" --filter="- *~"  --rsync-path=bin/rsync --delete-excluded -avz ./ zimeon.com:html/orcid-feed-js/
