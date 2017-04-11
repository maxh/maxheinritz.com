for file in *.jpg; do
    mv "$file" "`basename "$file" .jpg`.jpg1"
done
