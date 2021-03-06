import React, { useEffect, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import MoreIcon from "@material-ui/icons/MoreVert";
import {
  MenuItem,
  Menu,
  Avatar,
  ListSubheader,
  ListItemText,
  ListItemAvatar,
  ListItem,
  List,
  Fab,
  Paper,
  IconButton,
  Typography,
  Toolbar,
  CssBaseline,
  AppBar,
  Grid,
  Divider,
} from "@material-ui/core";

import useStyles from "./useStyles";
import { useDispatch, useSelector } from "react-redux";
import {
  dislikePost,
  fetchAllBlogs,
  likePost,
} from "../../redux/Actions/blogAction";
import Loading from "../../utils/Loading";
import moment from "moment";
import { logoutUser } from "../../redux/Actions/authAction";
import { BlogPostModal } from "./BlogPostModal/BlogPostModal";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Drawer from "./Drawer/Drawer";

export default function Home() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const logedInUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blog.blogs);

  useEffect(() => {
    dispatch(fetchAllBlogs());
  }, [dispatch, logedInUser]);

  const logOut = () => {
    dispatch(logoutUser());
  };

  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleClickOpenModal = () => {
    setOpenModal(true);
  };

  const myProfile = () => {
    window.location.pathname = "/my-profile/blogs";
  };

  const { likedPost } = useSelector((state) => state.auth.user);

  const likeHandler = (id) => {
    dispatch(dislikePost(logedInUser, id));
  };

  const unlikeHandler = (id) => {
    dispatch(likePost(logedInUser, id));
  };

  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <React.Fragment>
      <CssBaseline />
      <Grid
        className={classes.body}
        container
        justify="center"
        alignItems="center"
      >
        <Grid item xs={12} lg={8}>
          <Typography className={classes.text} variant="h5" gutterBottom>
            ????
          </Typography>
          {blogs && blogs.length ? (
            <Paper square className={classes.paper}>
              <List className={classes.list}>
                {blogs.map(
                  ({ _id, title, body, likeCount, user, createdAt }) => (
                    <React.Fragment key={_id}>
                      {
                        <ListSubheader className={classes.subheader}>
                          {moment(createdAt).fromNow()}
                        </ListSubheader>
                      }

                      <ListItem button alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar
                            alt={user.username.slice(0, 3)}
                            src={user.image}
                          ></Avatar>
                        </ListItemAvatar>

                        <ListItemText
                          primary={
                            <>
                              <small>
                                {user.username} ??? {""}{" "}
                                {moment(createdAt)
                                  .subtract(10, "days")
                                  .calendar()}
                              </small>
                              <Typography>{title} </Typography>
                            </>
                          }
                          secondary={
                            <div>
                              <Typography
                                component="span"
                                variant="body2"
                                color="textPrimary"
                              >
                                {body}
                              </Typography>
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                {likedPost.find((lk) => lk === _id) ? (
                                  <FavoriteIcon
                                    onClick={() => likeHandler(_id)}
                                    style={{
                                      marginLeft: "auto",
                                    }}
                                    color="primary"
                                    fontSize="default"
                                  />
                                ) : (
                                  <FavoriteBorderIcon
                                    onClick={() => unlikeHandler(_id)}
                                    style={{
                                      marginLeft: "auto",
                                    }}
                                    color="primary"
                                    fontSize="default"
                                  />
                                )}

                                <small
                                  style={{
                                    margin: "auto 0 auto 10px",
                                  }}
                                >
                                  {likeCount}
                                </small>
                              </div>
                            </div>
                          }
                        />
                      </ListItem>
                      <Divider light />
                    </React.Fragment>
                  )
                )}
              </List>
            </Paper>
          ) : (
            <Typography variant="h3">Posts not found ????</Typography>
          )}

          <AppBar position="fixed" color="primary" className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={() => setOpenDrawer((prev) => !prev)}
              >
                <Drawer />
              </IconButton>
              <Fab
                onClick={handleClickOpenModal}
                color="secondary"
                aria-label="add"
                className={classes.fabButton}
              >
                <AddIcon />
              </Fab>
              <div className={classes.grow} />

              <IconButton
                edge="end"
                color="inherit"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
              >
                <MoreIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                {/* <MenuItem onClick={myProfile}>My account</MenuItem> */}
                <MenuItem onClick={logOut}>Logout</MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>

          <BlogPostModal
            openModal={openModal}
            handleCloseModal={handleCloseModal}
            logedInUser={logedInUser}
            handleClickOpenModal={handleClickOpenModal}
            setOpenModal={setOpenModal}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
