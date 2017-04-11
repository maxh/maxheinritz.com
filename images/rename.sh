for file in *.jpg1; do
    mv "$file" "`basename "$file" .jpg1`.jpg"
done
