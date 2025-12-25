#!/usr/bin/env python3
"""
Encrypt add_remark220_column.py using Fernet symmetric encryption
"""

from cryptography.fernet import Fernet
from pathlib import Path
import base64

def encrypt_file():
    # Generate encryption key
    key = Fernet.generate_key()
    cipher = Fernet(key)
    
    # Read the original file
    source_file = Path(__file__).parent / 'add_remark220_column.py'
    encrypted_file = Path(__file__).parent / 'add_remark220_column.py.encrypted'
    key_file = Path(__file__).parent / 'encryption.key'
    
    with open(source_file, 'rb') as f:
        file_data = f.read()
    
    # Encrypt the data
    encrypted_data = cipher.encrypt(file_data)
    
    # Write encrypted file
    with open(encrypted_file, 'wb') as f:
        f.write(encrypted_data)
    
    # Save the key
    with open(key_file, 'wb') as f:
        f.write(key)
    
    print(f'✓ File encrypted successfully!')
    print(f'  Encrypted file: {encrypted_file}')
    print(f'  Key file: {key_file}')
    print(f'  Key (keep this safe): {key.decode()}')
    print(f'\n⚠ IMPORTANT: Keep the key file safe! Without it, you cannot decrypt the file.')

if __name__ == '__main__':
    encrypt_file()
