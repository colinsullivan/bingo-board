import unittest

from django.contrib.auth.models import User
from bingo.models import *

class BingoTests(unittest.TestCase):
    
    # Create a new bingo board
    def setUp(self):
        tempUser = User.objects.create(username='testuser', password='testpassword')
        board = Board.objects.create(user=tempUser)
        
        self.tempUser = tempUser
        self.board = board
        
        self.markers = self.board.marker_set.all()
        
    #   Make sure there are exactly 75 markers in the board
    def testMarkerCount(self):
        num_markers = self.markers.count()
        
        #   Make sure correct amount of markers is being created.
        self.assertEqual(num_markers, 75, 'Number of markers created for board is '+str(num_markers)+', should be '+str(75))
        
    #   Make sure every marker only appears once
    def testMarkerUnique(self):
        #   Make sure no marker appears more than once, and all markers exist
        allowedMarkers = range(1,76)
        for marker in self.markers:
            if marker.number in allowedMarkers:
                allowedMarkers.remove(marker.number)
            else:
                raise Exception('Marker '+str(marker.number)+' not allowed!')
                
        self.assertEqual(len(allowedMarkers), 0, 'The following markers are missing: '+str(allowedMarkers))
        
    def testBoardDeletion(self):
        # delete board
        self.board.delete()
        
        self.assertEqual(len(self.markers), 0, 'Markers were not deleted with board.')
        
                
            
        
        
        
        
