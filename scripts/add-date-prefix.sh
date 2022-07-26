
for file in _notes/*; do
  created_at=$(GetFileInfo -d "$file" | awk '{print $1}')
  month=$(cut -d "/" -f1 <<< "$created_at")
  day=$(cut -d "/" -f2 <<< "$created_at")
  year=$(cut -d "/" -f3 <<< "$created_at")
  basename=$(basename "$file")
  newfile="$year"-"$month"-"$day"-"$basename"
  cp "$file" "_posts/$newfile"
done