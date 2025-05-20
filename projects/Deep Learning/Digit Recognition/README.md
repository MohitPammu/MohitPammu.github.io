# Street View House Numbers (SVHN) Digit Recognition

<img src="https://raw.githubusercontent.com/MohitPammu/Projects/main/assets/images/digit-recognition.jpg" alt="SVHN Dataset Example" width="600">

## Project Overview
This project demonstrates deep learning techniques for recognizing digits from the Street View House Numbers (SVHN) dataset. Using both Artificial Neural Networks (ANNs) and Convolutional Neural Networks (CNNs), the project showcases how modern deep learning approaches can be applied to real-world computer vision tasks.

## Context & Background
Object recognition in natural scenes presents significant challenges in computer vision. The SVHN dataset, derived from Google Street View images, is widely used for developing and benchmarking digit recognition models. Google has used similar techniques to improve map quality by automatically transcribing address numbers from street-level photos, helping to pinpoint building locations when combined with known street addresses.

## Project Objectives
- Implement and compare multiple neural network architectures for digit recognition
- Evaluate the performance differences between traditional ANNs and specialized CNNs
- Analyze the impact of various deep learning techniques including dropout, batch normalization, and architectural choices
- Develop a high-performing model suitable for real-world digit recognition applications

## Dataset
The project uses a pre-processed subset of the SVHN dataset to reduce computation time:
- **Training set**: 42,000 labeled digit images
- **Testing set**: 18,000 labeled digit images
- **Image dimensions**: 32×32 pixels, RGB color (3 channels)
- **Format**: HDF5 file (.h5) with basic preprocessing already applied
- **Classes**: 10 classes representing digits 0-9

## Model Architectures & Results

### ANN Models
1. **ANN Model 1**: Simple baseline architecture
   - 2 hidden layers
   - Accuracy: ~60%
   - Training time: ~1 minute
   - Parameters: ~69,000

2. **ANN Model 2**: Enhanced architecture
   - 5 hidden layers with increased complexity
   - Dropout regularization (0.25-0.4)
   - Batch normalization
   - Accuracy: ~71%
   - Training time: ~2 minutes
   - Parameters: ~310,000

### CNN Models
1. **CNN Model 1**: Basic convolutional architecture
   - 2 convolutional layers with 16 and 32 filters
   - MaxPooling and Dropout
   - Accuracy: ~85%
   - Training time: ~3 minutes
   - Parameters: ~267,000
   - Inference speed: 0.0011s per image

2. **CNN Model 2**: Advanced convolutional architecture
   - 4 convolutional layers with progressive filter sizes [16→32→32→64]
   - Batch normalization after each convolutional layer
   - LeakyReLU activation functions
   - Strategic dropout placement (0.5)
   - Accuracy: ~89%
   - F1-score: ~89%
   - Training time: ~7 minutes  
   - Parameters: ~164,000
   
### AutoML Model
1. **AutoML CNN Model**: Automatically optimized architecture
   - Hyperparameter tuning with Keras Tuner (RandomSearch)
   - 2 convolutional layers with optimized filter counts [64→128]
   - Batch normalization for training stability
   - LeakyReLU activation with tuned alpha parameter
   - Optimized dropout rate (0.2)
   - Accuracy: ~89%
   - Training time: ~6 minutes
   - Parameters: ~265,000
   - Learning rate: 0.0001 (optimized)

## Key Findings
- CNNs significantly outperformed ANNs for this image recognition task (+18% accuracy)
- Strategic architectural decisions delivered superior results with fewer parameters - CNN Model 2 achieved higher accuracy despite using 40% fewer parameters than CNN Model 1
- Batch normalization improved model stability and convergence speed
- Dropout was effective in reducing overfitting, especially in deeper networks
- LeakyReLU activations performed better than standard ReLU for this dataset
- Trade-off observed between inference speed and accuracy (CNN Model 1 offers 2.7× faster inference)
- Automated hyperparameter optimization (AutoML) achieved comparable performance to manual tuning, confirming the effectiveness of our manual design choices

## Comparative Results

| Model | Accuracy | Parameters | Training Time | Inference Speed | Key Features |
|-------|:--------:|:----------:|:-------------:|:---------------:|:-------------|
| ANN Model 1 | ~60% | ~69,000 | ~45s | - | Basic feedforward network |
| ANN Model 2 | ~71% | ~310,000 | ~1m 36s | 0.0003s* | Dropout (0.2), BatchNorm |
| CNN Model 1 | ~85% | ~267,000 | ~3m 5s | 0.0011s | LeakyReLU, 2 conv layers |
| CNN Model 2 | ~89% | ~164,000 | ~7m 3s | 0.0004s* | BatchNorm, Dropout (0.5) |
| AutoML Model | ~89% | ~265,000 | ~6m | - | Optimized hyperparameters |

*Per image in batch processing of 100 images

The table shows that while CNN Model 2 and the AutoML model achieved similar accuracy, they represent different trade-offs in terms of parameters, training time, and architectural complexity. CNN Model 1 offers an excellent balance for many applications where deployment speed matters more than achieving the highest possible accuracy.

## Getting Started

### Prerequisites
- Python 3.7+
- Required libraries (see requirements.txt)

### Installation
```bash
# Clone the repository
git clone https://github.com/MohitPammu/SVHN-Digit-Recognition.git

# Navigate to the project directory
cd SVHN-Digit-Recognition

# Install required packages
pip install -r requirements.txt
```

## Hyperparameter Optimization

The project implements automated machine learning (AutoML) techniques to systematically search for optimal hyperparameter configurations:

### Search Space
- **Convolutional Filters**: First layer [16, 32, 48, 64], Second layer [32, 64, 96, 128]
- **Activation Functions**: ReLU vs. LeakyReLU with alpha [0.01-0.3]
- **Batch Normalization**: On/Off after convolutional layers
- **Dense Layer Units**: [32, 64, 96, 128]
- **Dropout Rate**: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5]
- **Learning Rate**: [0.0001, 0.0005, 0.001, 0.005]

### Optimization Strategy
- **Algorithm**: RandomSearch with Keras Tuner
- **Trials**: 10 distinct hyperparameter combinations
- **Objective**: Maximize validation accuracy
- **Early Stopping**: Patience of 3 epochs

### Optimal Configuration
The best performing configuration featured:
- 64 filters in first convolutional layer
- 128 filters in second convolutional layer
- Batch normalization enabled
- Dropout rate of 0.2
- Learning rate of 0.0001
- Dense layer with 64 units

This hyperparameter optimization approach identified an architecture that matched our best manually designed model in accuracy (~89%) while providing insights into the most important factors for model performance.

## Project Structure
```
.
├── MohitPammu_SVHN_Digit_Recognition.ipynb   # Main project notebook
├── Low_Code_SVHN_Digit_Recognition.ipynb     # Alternative implementation
├── README.md                                 # Project documentation
├── requirements.txt                          # Required dependencies
├── images/                                   # Project images
│   └── digit-recognition.jpg                 # SVHN dataset example image
├── hyperparameter_tuning/                    # AutoML experiment files
│   └── svhn_digits/                          # AutoML trials and configurations
└── models/                                   # Saved trained models
    ├── ANN_Model1_*.keras                    # ANN model 1 files
    ├── ANN_Model2_*.keras                    # ANN model 2 files
    ├── CNN_Model1_*.keras                    # CNN model 1 files
    ├── CNN_Model2_*.keras                    # CNN model 2 files
    └── AutoML_CNN_Model_*.keras              # AutoML model files
```

## Applications
- Street address number recognition
- Automated data entry from images
- Document digitization
- Image-based CAPTCHA systems

## Author
**Mohit Pammu, MBA**

## Acknowledgments
- The SVHN Dataset creators and maintainers
- MIT Applied Data Science Program