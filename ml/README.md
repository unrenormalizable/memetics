# memetics - ML pipeline

Pipeline:
- Make consistent name
- Preprocess pics 
  - Make all jpeg
  - Make less than 800x800
  - Generate thumb-nails
- Extract text
  - remove less than 2 letter words, non english characters
  - remove non valid words
- Generate index.db
- Upload pic / thumbnail / images to azure

Note:
- Using WSL / GPU stuff. TF/Keras on GPU doesn't seem to work otherwise.
- ```nb-clean clean *.ipynb -e -M```

References:
- [keras-ocr](https://github.com/faustomorales/keras-ocr)
- [Extract text top-down left-right](https://github.com/shegocodes/keras-ocr)
