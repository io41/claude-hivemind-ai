# Python Analytics Skill

## When to Use
- Data analysis and exploration
- Machine learning models
- Statistical analysis
- Data pipelines and ETL
- Jupyter notebooks / scripts

## Technology Stack
- **pandas** - Data manipulation
- **numpy** - Numerical computing
- **scikit-learn** - ML algorithms
- **xgboost** / **lightgbm** - Gradient boosting
- **matplotlib** / **seaborn** - Visualization
- **requests** / **httpx** - Data fetching

## Setup

```bash
pip install pandas numpy scikit-learn xgboost lightgbm matplotlib seaborn
```

## Data Loading

```python
import pandas as pd
import numpy as np

# CSV
df = pd.read_csv('data.csv')
df = pd.read_csv('data.csv', parse_dates=['date'], index_col='id')

# JSON
df = pd.read_json('data.json')
df = pd.read_json('data.json', lines=True)  # JSON lines

# SQL
from sqlalchemy import create_engine
engine = create_engine('postgresql://user:pass@localhost/db')
df = pd.read_sql('SELECT * FROM users', engine)
df = pd.read_sql_query('SELECT * FROM users WHERE active = true', engine)

# Excel
df = pd.read_excel('data.xlsx', sheet_name='Sheet1')

# Parquet (efficient for large data)
df = pd.read_parquet('data.parquet')
df.to_parquet('output.parquet')
```

## Data Exploration

```python
# Overview
df.head()
df.tail()
df.info()
df.describe()
df.shape
df.columns
df.dtypes

# Missing values
df.isnull().sum()
df.isnull().sum() / len(df) * 100  # Percentage

# Unique values
df['column'].nunique()
df['column'].value_counts()

# Correlations
df.corr()
df[['col1', 'col2', 'col3']].corr()
```

## Data Cleaning

```python
# Handle missing values
df.dropna()                          # Drop rows with any NaN
df.dropna(subset=['col1', 'col2'])   # Drop if specific cols are NaN
df.fillna(0)                         # Fill with value
df.fillna(df.mean())                 # Fill with mean
df['col'].fillna(df['col'].median()) # Fill with median
df.interpolate()                     # Interpolate

# Remove duplicates
df.drop_duplicates()
df.drop_duplicates(subset=['col1', 'col2'], keep='first')

# Type conversion
df['col'] = df['col'].astype(int)
df['date'] = pd.to_datetime(df['date'])
df['category'] = df['category'].astype('category')

# String operations
df['name'] = df['name'].str.lower()
df['name'] = df['name'].str.strip()
df['name'] = df['name'].str.replace('old', 'new')

# Outliers (IQR method)
Q1 = df['col'].quantile(0.25)
Q3 = df['col'].quantile(0.75)
IQR = Q3 - Q1
df_clean = df[(df['col'] >= Q1 - 1.5*IQR) & (df['col'] <= Q3 + 1.5*IQR)]
```

## Data Transformation

```python
# Select columns
df[['col1', 'col2']]
df.loc[:, 'col1':'col3']

# Filter rows
df[df['col'] > 100]
df[(df['col1'] > 100) & (df['col2'] == 'value')]
df.query('col1 > 100 and col2 == "value"')

# Sort
df.sort_values('col', ascending=False)
df.sort_values(['col1', 'col2'], ascending=[True, False])

# Group and aggregate
df.groupby('category')['value'].mean()
df.groupby('category').agg({
    'value': ['mean', 'sum', 'count'],
    'other': 'max'
})

# Pivot
df.pivot_table(
    values='value',
    index='category',
    columns='date',
    aggfunc='sum'
)

# Merge/Join
pd.merge(df1, df2, on='key')
pd.merge(df1, df2, left_on='key1', right_on='key2', how='left')
df1.join(df2, on='key')

# Concat
pd.concat([df1, df2], axis=0)  # Vertical
pd.concat([df1, df2], axis=1)  # Horizontal

# Apply functions
df['new'] = df['col'].apply(lambda x: x * 2)
df['new'] = df.apply(lambda row: row['a'] + row['b'], axis=1)
```

## Feature Engineering

```python
# Date features
df['year'] = df['date'].dt.year
df['month'] = df['date'].dt.month
df['day'] = df['date'].dt.day
df['dayofweek'] = df['date'].dt.dayofweek
df['is_weekend'] = df['date'].dt.dayofweek >= 5

# Binning
df['age_group'] = pd.cut(df['age'], bins=[0, 18, 35, 50, 100],
                         labels=['young', 'adult', 'middle', 'senior'])

# One-hot encoding
df_encoded = pd.get_dummies(df, columns=['category'])

# Label encoding
from sklearn.preprocessing import LabelEncoder
le = LabelEncoder()
df['category_encoded'] = le.fit_transform(df['category'])

# Scaling
from sklearn.preprocessing import StandardScaler, MinMaxScaler
scaler = StandardScaler()
df[['col1', 'col2']] = scaler.fit_transform(df[['col1', 'col2']])

# Log transform (for skewed data)
df['log_col'] = np.log1p(df['col'])  # log(1+x), handles zeros

# Lag features (time series)
df['lag_1'] = df['value'].shift(1)
df['rolling_mean_7'] = df['value'].rolling(window=7).mean()
```

## Machine Learning

### Train/Test Split
```python
from sklearn.model_selection import train_test_split

X = df.drop('target', axis=1)
y = df['target']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
```

### Classification
```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# Train
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Predict
y_pred = model.predict(X_test)

# Evaluate
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(classification_report(y_test, y_pred))
print(confusion_matrix(y_test, y_pred))
```

### Regression
```python
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.4f}")
print(f"MAE: {mean_absolute_error(y_test, y_pred):.4f}")
print(f"R2: {r2_score(y_test, y_pred):.4f}")
```

### XGBoost
```python
import xgboost as xgb

# For classification
model = xgb.XGBClassifier(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    random_state=42
)
model.fit(X_train, y_train)

# For regression
model = xgb.XGBRegressor(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    random_state=42
)
model.fit(X_train, y_train)

# Feature importance
importance = model.feature_importances_
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': importance
}).sort_values('importance', ascending=False)
```

### LightGBM
```python
import lightgbm as lgb

# For classification
model = lgb.LGBMClassifier(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    random_state=42
)
model.fit(X_train, y_train)

# For regression
model = lgb.LGBMRegressor(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    random_state=42
)
model.fit(X_train, y_train)
```

### Cross-Validation
```python
from sklearn.model_selection import cross_val_score, KFold

cv = KFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model, X, y, cv=cv, scoring='accuracy')

print(f"CV Accuracy: {scores.mean():.4f} (+/- {scores.std()*2:.4f})")
```

### Hyperparameter Tuning
```python
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV

param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [3, 6, 9],
    'learning_rate': [0.01, 0.1, 0.3]
}

grid_search = GridSearchCV(
    model, param_grid, cv=5, scoring='accuracy', n_jobs=-1
)
grid_search.fit(X_train, y_train)

print(f"Best params: {grid_search.best_params_}")
print(f"Best score: {grid_search.best_score_:.4f}")
```

## Visualization

```python
import matplotlib.pyplot as plt
import seaborn as sns

# Set style
sns.set_style('whitegrid')
plt.figure(figsize=(10, 6))

# Histogram
plt.hist(df['col'], bins=30, edgecolor='black')
plt.xlabel('Value')
plt.ylabel('Frequency')
plt.title('Distribution')
plt.savefig('histogram.png', dpi=150, bbox_inches='tight')

# Scatter plot
plt.scatter(df['x'], df['y'], alpha=0.5)
plt.xlabel('X')
plt.ylabel('Y')

# Line plot
plt.plot(df['date'], df['value'])

# Box plot
sns.boxplot(x='category', y='value', data=df)

# Heatmap (correlation)
sns.heatmap(df.corr(), annot=True, cmap='coolwarm', center=0)

# Pair plot
sns.pairplot(df[['col1', 'col2', 'col3', 'target']], hue='target')

# Feature importance
plt.barh(feature_importance['feature'], feature_importance['importance'])
plt.xlabel('Importance')
plt.title('Feature Importance')
```

## Model Persistence

```python
import joblib

# Save model
joblib.dump(model, 'model.joblib')

# Load model
model = joblib.load('model.joblib')

# Save with preprocessing
pipeline = {
    'scaler': scaler,
    'encoder': encoder,
    'model': model
}
joblib.dump(pipeline, 'pipeline.joblib')
```

## Script Template

```python
#!/usr/bin/env python3
"""
Data analysis script for [purpose].
"""

import pandas as pd
import numpy as np
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_data(path: str) -> pd.DataFrame:
    """Load and validate data."""
    logger.info(f"Loading data from {path}")
    df = pd.read_csv(path)
    logger.info(f"Loaded {len(df)} rows")
    return df

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """Clean and preprocess data."""
    df = df.dropna(subset=['required_col'])
    df['date'] = pd.to_datetime(df['date'])
    return df

def analyze(df: pd.DataFrame) -> dict:
    """Perform analysis."""
    results = {
        'total_records': len(df),
        'mean_value': df['value'].mean(),
        'by_category': df.groupby('category')['value'].sum().to_dict()
    }
    return results

def main():
    # Load
    df = load_data('data.csv')

    # Clean
    df = clean_data(df)

    # Analyze
    results = analyze(df)

    # Output
    logger.info(f"Results: {results}")
    pd.DataFrame([results]).to_csv('results.csv', index=False)

if __name__ == '__main__':
    main()
```

## Related Skills
- `python-service` - FastAPI for ML APIs
- `database` - Data storage
