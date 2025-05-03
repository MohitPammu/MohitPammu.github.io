# Street View Housing Number (SVHN) Digit Recognition

## Project Overview
This project focuses on recognizing digits from the Street View Housing Number (SVHN) dataset using deep learning techniques. The SVHN dataset contains over 600,000 labeled digits cropped from street-level photos and is widely used for image recognition tasks.

## Context
Object recognition in natural scenes is a challenging task in deep learning. The SVHN dataset has been used by Google to improve map quality by automatically transcribing address numbers from pixel patches. This helps pinpoint building locations when combined with known street addresses.

## Objective
The goal is to predict digits in the images using:
1. Artificial Neural Networks (ANNs)
2. Convolutional Neural Networks (CNNs)

Multiple model architectures were implemented and compared to identify the most effective approach.

## Dataset
A subset of the original SVHN dataset was used to reduce computation time. The data was provided as an .h5 file with basic preprocessing already applied. The dataset includes:
- 42,000 training images
- 18,000 testing images

## Model Architectures

### Artificial Neural Networks (ANNs)
1. **ANN Model 1**: Simple architecture with 2 hidden layers
   - Accuracy: ~60%

2. **ANN Model 2**: More complex with 5 hidden layers, dropout, and batch normalization
   - Accuracy: ~76%

### Convolutional Neural Networks (CNNs)
1. **CNN Model 1**: Basic CNN with 2 convolutional layers
   - Accuracy: ~85%
   - Training time: ~3 minutes

2. **CNN Model 2**: More complex CNN with 4 convolutional layers, batch normalization, and dropout
   - Accuracy: ~90% (F1-score of 89%)
   - Training time: ~7 minutes

## Results
- CNN Model 2 achieved the best performance with 90% accuracy on the test set
- CNNs significantly outperformed ANNs for this image recognition task
- Batch normalization and dropout were effective in reducing overfitting
- Trade-off observed between model complexity, accuracy, and training time

## Getting Started

### Prerequisites
- Python 3.6+
- Required libraries (see requirements.txt)

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/svhn-digit-recognition.git

# Navigate to the project directory
cd svhn-digit-recognition

# Install required packages
pip install -r requirements.txt
```

### Running the Notebook
```bash
jupyter notebook MohitPammu_High_Code_SVHN_Digit_Recognition.ipynb
```

## Author
- **Mohit Pammu**