#!/bin/bash

source_folder="libs/shared/images/icons-sharp-light"
flags_source_folder="libs/shared/images/flags"
destination_folder="apps/dealer/public/svg"

rm -rf "$destination_folder"/*

while IFS= read -r filename; do
    cp "$source_folder/${filename}.svg" "$destination_folder/"
done < apps/dealer/icon.list.txt

while IFS= read -r filename; do
    cp "$flags_source_folder/${filename}.svg" "$destination_folder/"
done < apps/dealer/flags.list.txt
