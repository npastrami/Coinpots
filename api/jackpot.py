import random
import time

class Jackpot:
    def __init__(self) -> None:
        self.players = []
        self.total = 0
        pass
    
    def add_player(self, username, amount):
        self.players.append({'username': username, 'amount': amount})
        self.total += amount

    def remove_player(self, username):
        for player in self.players:
            if player['username'] == username:
                self.total -= player['amount']
                self.players.remove(player)
                break

    def jackpot_timer(self):
        print("Jackpot will start in 5 minutes.")
        time.sleep(3)  # Sleep for 5 minutes
        print("Jackpot is starting now!")

    def execute_jackpot(self):
        if not self.players:
            print("No players to execute the jackpot.")
            return None, None  # Indicate failure to execute jackpot

        # Start angle for the first segment
        start_angle = 0

        # List to hold (start_angle, end_angle) for each player's segment
        player_segments = []

        # Calculate segment sizes and store them
        for player in self.players:
            player_percentage = player['amount'] / self.total
            segment_size = 360 * player_percentage  # Segment size in degrees
            end_angle = start_angle + segment_size
            player_segments.append((start_angle, end_angle))
            start_angle = end_angle  # Next segment starts where the previous one ended

        # Select a random position (degree) on the wheel
        winning_position = random.uniform(0, 360)

        # Determine the winner based on the winning_position
        winner_index = -1
        for index, (start_angle, end_angle) in enumerate(player_segments):
            if start_angle <= winning_position < end_angle:
                winner_index = index
                break

        if winner_index == -1:
            print("Failed to determine a winner.")
            return None, None

        winner = self.players[winner_index]
        print(f"The jackpot winner is {winner['username']} with a winning position of {winning_position} degrees.")
        return winner['username'], winning_position
        