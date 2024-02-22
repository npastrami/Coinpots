from bitcoin.wallet import CBitcoinSecret, P2PKHBitcoinAddress
from bitcoin.core import b2x, x, lx

# Generate a new private key
private_key = CBitcoinSecret.from_random()

# Get the corresponding public key
public_key = private_key.pub

# Generate the Bitcoin address
address = P2PKHBitcoinAddress.from_pubkey(public_key)

print("Private Key:", private_key)
print("Public Key:", public_key)
print("Bitcoin Address:", address)