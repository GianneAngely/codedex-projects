# Write diary entries to a file, one entry per line
file = open('diaries.txt', 'w')
file.write('22 Nov: Finished the GitHub Copilot course on Codedex!\n')
file.write('22 Nov: Learned tuples, dictionaries, and sets in Intermediate Python.\n')
file.write('Secret: I want to finish my pixel art game before the year ends.\n')
file.close()

print(open('diaries.txt').read())
