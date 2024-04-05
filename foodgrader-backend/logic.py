''' https://en.wikipedia.org/wiki/Nutri-Score#:~:text=These%20are%3A%20fiber%2C%20protein%2C,awarded%20for%20the%20unwelcome%20ingredients '''

import numpy as np
import pandas as pd
#____________________
# Bad points
pointSysGrams = {
    # [start, divWidth, count]
    'energy' : [0, 80, 10],  #kCal
    'sugar' : [0, 4.5, 10],
    'fat' : [0, 1, 10],
    'salt'   : [0, 90, 10]
}
pointSysML = {
    # [start, divWidth, count]
    'energy' : [0, 7.2, 10],  #kCal
    'sugar' : [0, 1.5, 10],
    'fat' : [10, 1.5, 10],
    'salt'   : [0, 90, 10]
}
#____________________
# Good points 
fruitsPercentage = {
    '0-20' : 0,
    '20-40' : 2,
    '40-80' : 4,
    '80-101' : 5
}
others = {
    # [start, divWidth, count]
    'fiber'  : [0, 0.7, 5],
    'protein': [0, 1.6, 5]
}
# TotalScore = BadPoints - GoodPoints
FinalGrade = {
    'A' : [-100, -1], 'B' : [0, 2], 'C' : [3, 10], 'D' : [11, 18], 'E' : [19, 100]
}
#____________________
def getAns(quantities, typeFood, weights):
    global grades
    ingredients = ['energy', 'sugar', 'fat', 'salt', 'fruit', 'fiber', 'protein']
    N_points = 0
    P_points = 0
    TBR = {}

    if typeFood == 0:
        # For N points
        for i in range(4):
            temp = pointSysGrams[ingredients[i]]
            temp[1] = temp[1]/weights[i]
            points = 0
            j = temp[0]
            while j <= temp[0] + temp[1] * temp[2]:
                if j <= quantities[i] <= j + temp[1]:
                    break
                points += 1
                j += temp[1]
            TBR[(ingredients[i]).capitalize()] = str(min((max(0,points)+((quantities[i]%max(1,temp[1])))%10),10))+' / 10'

            N_points += points

    else:
        # For N points
        for i in range(4):
            temp = pointSysML[ingredients[i]]
            temp[1] = temp[1]/weights[i]
            points = 0
            j = temp[0]
            while j <= temp[0] + temp[1] * temp[2]:
                if j <= quantities[i] <= j + temp[1]:
                    break
                points += 1
                j += temp[1]
            TBR[(ingredients[i]).capitalize()] = str(min(max(10-points+1, 0),10))+' / 10'
            N_points += points

    # For P points
    for i in fruitsPercentage:
        lower, upper = [float(i.split('-')[0]),float(i.split('-')[1])]
        lower *= weights[4]
        upper *= weights[4]
        if lower <= quantities[4] <= upper:
            P_points += fruitsPercentage[i]
            TBR['Fruit'] = str(min((max(0,fruitsPercentage[i])+((quantities[4]%max(1,lower)))%10),10)) + ' / 10'

            break
    for i in range(5, 7):
        temp = others[ingredients[i]]
        temp[1] *= weights[i]
        points = 0
        j = temp[0]
        while j <= temp[0] + temp[1] * temp[2]:
            if j <= quantities[i] <= j + temp[1]:
                break
            points += 1
            j += temp[1]
        TBR[(ingredients[i]).capitalize()] = str(min((points+((quantities[i]%max(1,temp[1]))%10),10)))+' / 10'
        P_points += points

    totalScore = N_points - P_points
#     print('total score is : ', totalScore)
    LastGrade = ""
    for i in FinalGrade:
        if FinalGrade[i][0] <= totalScore <= FinalGrade[i][1]:
            LastGrade = i
#             grades.append(i)
            break
    return [LastGrade,TBR]


#____________________----------------
def getScore(d, mode='normal'):
    disease = ['normal','diabetes','lactoseIntolerant'] 
    weights = [[1,1,1,1,1,1,1],[1,1.25,1,1.1,1,1.1,1.1],[1,1.2,1,1.1,1.1,0.9,1]]
    weights = weights[disease.index(mode)]
    ingredients = {'energy':0, 'sugar':1, 'fat':2, 'salt':3, 'fruit':4, 'fiber':5, 'protein':6}
    quantities = [0]*7
    values = ['energy', 'sugar', 'fat', 'salt', 'fruit', 'fiber', 'protein']
    fatt = [-1]
    
    for i in d:
        ans = ""
        got = 0
        for z in str(d[i]):
            if got == 0:
                if (z.isdigit() or z == '.'):
                    got = 1
                    ans += z
            else:
                if not (z.isdigit() or z == '.'):
                    break
                ans += z
        if ans == '':
            ans = 0
        else:
            ans = float(ans)
        k = i.lower().replace(" ", '')
        if 'fat' in k:
            if 'sat' in k and 'un' not in k:
                fatt[0] = 1
                quantities[2] = ans
            elif fatt[0] == -1:
                fatt[0] = 0
                quantities[2] = ans
        elif 'salt' in k or 'sodium' in k or 'nacl' in k:
            quantities[3] = ans
        else:
            for j in values:
                if j in k:
                    quantities[ingredients[j]] = ans
                    break
    newInp = {}
    x = 0
    for i in values:
        newInp[i.lower()+'_i'] = str(quantities[x])
        x += 1
    fResult = getAns(quantities, 0, weights)
    for i in fResult[1]:
        newInp[i.lower()+'_o'] = str(fResult[1][i])
    newInp['finalGrade'] = fResult[0]
    return fResult+[newInp]