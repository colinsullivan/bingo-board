import unittest

from django.contrib.auth.models import User
from bingo.models import *

from django.utils import simplejson

from bingo.api import *

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
        
    ###
    #   Make sure that the board has a serialized list of markers
    ###
    def testBoardMarkerCache(self):
        markers_serialized = self.board.markers_serialized
        
        markers_dicts = simplejson.loads(markers_serialized)
        
        self.assertEqual(len(markers_dicts), 75, 'There should be 75 markers in the serialized representation')
        
        
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
        
    #   Make sure timestamp is being updated when each marker is changed
    def testMarkerChangeEvent(self):
        
        markerOne = self.markers[0]
        markerOne.value = True
        markerOne.save()
        
        markerTwo = self.markers[1]
        markerTwo.value = True
        markerTwo.save()
        
        # there should be 2 such events, one for each marker
        self.assertTrue(markerOne.updated_at < markerTwo.updated_at)
        
        # Make sure that board was updated
        self.board = Board.objects.get(pk = self.board.id)
        marker_dicts = simplejson.loads(self.board.markers_serialized)
        
        ##  Make sure cache was updated correctly.
        for marker_dict in marker_dicts:
            marker_dict_id = marker_dict['id']
            if marker_dict_id == markerOne.id:
                self.assertEqual(marker_dict['value'], markerOne.value, 'Marker is not being updated in board cache')
            elif marker_dict_id == markerTwo.id:
                self.assertEqual(marker_dict['value'], markerTwo.value, 'Marker is not being updated in board cache')
                
        markerOne.value = False
        markerOne.save()
        
        self.board = Board.objects.get(pk = self.board.id)
        marker_dicts = simplejson.loads(self.board.markers_serialized)
        
        ##  Make sure cache was updated correctly.
        for marker_dict in marker_dicts:
            marker_dict_id = marker_dict['id']
            if marker_dict_id == markerOne.id:
                self.assertEqual(marker_dict['value'], markerOne.value, 'Marker is not being updated in board cache')
            elif marker_dict_id == markerTwo.id:
                self.assertEqual(marker_dict['value'], markerTwo.value, 'Marker is not being updated in board cache')
        
        
        
    def testBoardDeletion(self):
        # delete board
        self.board.delete()
        
        self.assertEqual(len(self.markers), 0, 'Markers were not deleted with board.')
        
