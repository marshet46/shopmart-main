import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../redux/slice/dataSlice';
import { Grid, Typography, Paper, CircularProgress,Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.dashboardData2);
  const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    textAlign: 'center',
    color: '#fff', // Text color
    background: 'linear-gradient(45deg, #D5A30D 30%, #131212 90%)', // Gradient background
    boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.2)', // Shadow
    borderRadius: '12px',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  }));
  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      {data && (
        <div>
        <Grid container spacing={4}>
        <Grid item xs={12}>
            <Divider />
            <Typography variant="h3">Data analayis </Typography>
          </Grid>
         
          <Grid item xs={12} md={6} lg={4}>
            <StyledPaper>
              <Typography variant="h5">Campanies</Typography>
              <Typography variant="h4">{data.countData.companies}</Typography>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <StyledPaper>
              <Typography variant="h5">Deposits </Typography>
              <Typography variant="h4">{data.countData.deposits}</Typography>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <StyledPaper>
              <Typography variant="h5">News </Typography>
              <Typography variant="h4">{data.countData.news}</Typography>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <StyledPaper>
              <Typography variant="h5">Deposits </Typography>
              <Typography variant="h4">{data.countData.deposits}</Typography>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <StyledPaper>
              <Typography variant="h5">Sell Stocks Orders </Typography>
              <Typography variant="h4">{data.countData.sellStocks}</Typography>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <StyledPaper>
              <Typography variant="h5">Buy  Stocks Orders </Typography>
              <Typography variant="h4">{data.countData.stockOrders}</Typography>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <StyledPaper>
              <Typography variant="h5">Total Stocks </Typography>
              <Typography variant="h4">{data.countData.stocks}</Typography>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <StyledPaper>
              <Typography variant="h5">Total Users </Typography>
              <Typography variant="h4">{data.countData.users}</Typography>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <StyledPaper>
              <Typography variant="h5">Total Users </Typography>
              <Typography variant="h4">{data.countData.users}</Typography>
            </StyledPaper>
          </Grid>
          </Grid>
          <Grid container spacing={4}>
        <Grid item xs={12}>
            <Divider />
            <Typography variant="h3">Deposit Requests </Typography>
          </Grid>         
              <Grid item xs={12} md={6} lg={4}>
            <StyledPaper>
              <Typography variant="h5">Approved Deposit Requests </Typography>
              <Typography variant="h4">{data.deposits.approved}</Typography>
            </StyledPaper>
          </Grid>
                    
              <Grid item xs={12} md={6} lg={4}>
            <StyledPaper>
              <Typography variant="h5"> Rejected Deposit Requests</Typography>
              <Typography variant="h4">{data.deposits.rejected}</Typography>
            </StyledPaper>
          
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <StyledPaper>
              <Typography variant="h5"> Pending Deposit Requests</Typography>
              <Typography variant="h4">{data.deposits.pending}</Typography>
            </StyledPaper>          
          </Grid>
          </Grid>
          
          <Grid container spacing={4}>
        <Grid item xs={12}>
            <Divider />
            <Typography variant="h3">Sell stock Requests </Typography>
          </Grid>         
              <Grid item xs={12} md={6} lg={4}>
            <StyledPaper>
              <Typography variant="h5">Approved Sell stock Requests </Typography>
              <Typography variant="h4">{data.sellStocks.approved}</Typography>
            </StyledPaper>
          </Grid>
                    
              <Grid item xs={12} md={6} lg={4}>
            <StyledPaper>
              <Typography variant="h5"> Rejected Sell Stock Requests</Typography>
              <Typography variant="h4">{data.sellStocks.rejected}</Typography>
            </StyledPaper>
          
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <StyledPaper>
              <Typography variant="h5"> Pending Sell stock Requests</Typography>
              <Typography variant="h4">{data.sellStocks.pending}</Typography>
            </StyledPaper>          
          </Grid>
          </Grid>
          
          <Grid container spacing={4}>
        <Grid item xs={12}>
            <Divider />
            <Typography variant="h3">buy stock Requests </Typography>
          </Grid>         
              <Grid item xs={12} md={6} lg={4}>
            <StyledPaper>
              <Typography variant="h5">Approved buy stock Requests </Typography>
              <Typography variant="h4">{data.stockOrders.approved}</Typography>
            </StyledPaper>
          </Grid>
                    
              <Grid item xs={12} md={6} lg={4}>
            <StyledPaper>
              <Typography variant="h5"> Rejected buy  Stock Requests</Typography>
              <Typography variant="h4">{data.stockOrders.rejected}</Typography>
            </StyledPaper>
          
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <StyledPaper>
              <Typography variant="h5"> Pending Buy stock Requests</Typography>
              <Typography variant="h4">{data.stockOrders.pending}</Typography>
            </StyledPaper>          
          </Grid>
          </Grid>
          <Grid container spacing={4}>
        <Grid item xs={12}>
            <Divider />
            <Typography variant="h3">WithDrawal Requests </Typography>
          </Grid>         
              <Grid item xs={12} md={6} lg={4}>
            <StyledPaper>
              <Typography variant="h5">Approved withdrawals Requests </Typography>
              <Typography variant="h4">{data.withdrawals.approved}</Typography>
            </StyledPaper>
          </Grid>
                    
              <Grid item xs={12} md={6} lg={4}>
            <StyledPaper>
              <Typography variant="h5"> Rejected WithDrawals Requests</Typography>
              <Typography variant="h4">{data.withdrawals.rejected}</Typography>
            </StyledPaper>
          
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <StyledPaper>
              <Typography variant="h5"> Pending Withdrawal Requests</Typography>
              <Typography variant="h4">{data.withdrawals.pending}</Typography>
            </StyledPaper>          
          </Grid>
          </Grid>
         

        </div>
      )}
    </div>
  );
};

export default Dashboard;
