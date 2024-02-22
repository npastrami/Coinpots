import random
import time

class Jackpot:
    def __init__(self) -> None:
        # take dictionary of username and input amount
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
            return
            
        # Calculate cumulative percentages
        cumulative_percentages = []
        cumulative_percentage = 0.0
        for player in self.players:
            player_percentage = player['amount'] / self.total
            cumulative_percentage += player_percentage
            print(f'{player["username"]} has {player_percentage} chance of winning!')
            cumulative_percentages.append(cumulative_percentage)

        # Select a winner based on cumulative percentages
        random_number = random.random()
        for i, cumulative_percentage in enumerate(cumulative_percentages):
            if random_number < cumulative_percentage:
                winner_index = i
                break

        winner = self.players[winner_index]
        print(f"The jackpot winner is {winner['username']}!")
        
jackpot = Jackpot()
jackpot.add_player('Alice', 100)
jackpot.add_player('Bob', 200)
jackpot.add_player('Charlie', 150)

jackpot.jackpot_timer()
jackpot.execute_jackpot()