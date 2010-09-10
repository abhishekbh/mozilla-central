/* -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Places.
 *
 * The Initial Developer of the Original Code is
 * Google Inc.
 * Portions created by the Initial Developer are Copyright (C) 2005
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *  Brian Ryner <bryner@brianryner.com>
 *  Dietrich Ayala <dietrich@mozilla.com>
 *  Shawn Wilsher <me@shawnwilsher.com>
 *  Marco Bonardo <mak77@bonardo.net>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

const Ci = Components.interfaces;
const Cc = Components.classes;
const Cr = Components.results;
const Cu = Components.utils;

Cu.import("resource://gre/modules/Services.jsm");

// Import common head.
let (commonFile = do_get_file("../head_common.js", false)) {
  let uri = Services.io.newFileURI(commonFile);
  Services.scriptloader.loadSubScript(uri.spec, this);
}

// Put any other stuff relative to this test folder below.


/**
 * Function tests to see if the place associated with the bookmark with id
 * aBookmarkId has the uri aExpectedURI.  The event will call do_test_finished()
 *  if aFinish is true.
 *
 * @param aBookmarkId
 *        The bookmark to check against.
 * @param aExpectedURI
 *        The URI we expect to be in moz_places.
 * @param aExpected
 *        Indicates if we expect to get a result or not.
 * @param [optional] aFinish
 *        Indicates if the test should be completed or not.
 */
function new_test_bookmark_uri_event(aBookmarkId, aExpectedURI, aExpected, aFinish)
{
  let stmt = DBConn().createStatement(
    "SELECT moz_places.url " +
    "FROM moz_bookmarks INNER JOIN moz_places " +
    "ON moz_bookmarks.fk = moz_places.id " +
    "WHERE moz_bookmarks.id = ?1"
  );
  stmt.bindInt64Parameter(0, aBookmarkId);

  if (aExpected) {
    do_check_true(stmt.executeStep());
    do_check_eq(stmt.getUTF8String(0), aExpectedURI);
  }
  else {
    do_check_false(stmt.executeStep());
  }
  stmt.reset();
  stmt.finalize();
  stmt = null;

  if (aFinish)
    do_test_finished();
}


/**
 * Function tests to see if the place associated with the visit with id aVisitId
 * has the uri aExpectedURI.  The event will call do_test_finished() if aFinish is
 * true.
 *
 * @param aVisitId
 *        The visit to check against.
 * @param aExpectedURI
 *        The URI we expect to be in moz_places.
 * @param aExpected
 *        Indicates if we expect to get a result or not.
 * @param [optional] aFinish
 *        Indicates if the test should be completed or not.
 */
function new_test_visit_uri_event(aVisitId, aExpectedURI, aExpected, aFinish)
{
  let stmt = DBConn().createStatement(
    "SELECT moz_places.url " +
    "FROM moz_historyvisits INNER JOIN moz_places " +
    "ON moz_historyvisits.place_id = moz_places.id " +
    "WHERE moz_historyvisits.id = ?1"
  );
  stmt.bindInt64Parameter(0, aVisitId);

  if (aExpected) {
    do_check_true(stmt.executeStep());
    do_check_eq(stmt.getUTF8String(0), aExpectedURI);
  }
  else {
    do_check_false(stmt.executeStep());
  }
  stmt.reset();
  stmt.finalize();
  stmt = null;

  if (aFinish)
    do_test_finished();
}
