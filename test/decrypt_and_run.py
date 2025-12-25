#!/usr/bin/env python3
"""
Decrypt and run the encrypted add_remark220_column.py file
"""

from cryptography.fernet import Fernet
from pathlib import Path
import sys

def decrypt_and_run():
    # Read the key
    key_file = Path(__file__).parent / 'encryption.key'
    encrypted_file = Path(__file__).parent / 'add_remark220_column.py.encrypted'
    
    if not key_file.exists():
        print('✗ Key file not found!')
        return False
    
    if not encrypted_file.exists():
        print('✗ Encrypted file not found!')
        return False
    
    with open(key_file, 'rb') as f:
        key = f.read()
    
    cipher = Fernet(key)
    
    # Read and decrypt the file
    with open(encrypted_file, 'rb') as f:
        encrypted_data = f.read()
    
    decrypted_data = cipher.decrypt(encrypted_data)
    
    # Execute the decrypted code with proper globals
    exec(decrypted_data, {'__name__': '__main__', '__file__': str(encrypted_file)})
    
    return True

if __name__ == '__main__':
    decrypt_and_run()
